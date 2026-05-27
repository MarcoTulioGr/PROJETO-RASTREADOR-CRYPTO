async function buscarMoedas() {
  document.getElementById('carregando').style.display = 'block'

  const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10'
  const resposta = await fetch(url)
  const moedas = await resposta.json()

  const tabela = document.getElementById('lista-moedas')
  tabela.innerHTML = ''

  moedas.forEach(function(moeda, indice) {
    const linha = document.createElement('tr')

    const variacao = moeda.price_change_percentage_24h ? moeda.price_change_percentage_24h.toFixed(2) : '0.00'
    const cor = Number(variacao) >= 0 ? 'green' : 'red'
    linha.addEventListener('click', function() {
  abrirModal(moeda)
})
    linha.innerHTML = `
      <td>${indice + 1}</td>
      <td><img src="${moeda.image}" width="24" style="vertical-align:middle; margin-right:8px">${moeda.name}</td>
      <td>$${moeda.current_price.toLocaleString()}</td>
      <td>
  <span style="
    background: ${cor === 'green' ? 'rgba(0,200,100,0.15)' : 'rgba(255,70,70,0.15)'};
    color: ${cor};
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: bold;
  ">
    ${Number(variacao) >= 0 ? '↑' : '↓'} ${variacao}%
  </span>
</td>
    `

    tabela.appendChild(linha)
  })

  document.getElementById('carregando').style.display = 'none'
}

function atualizarRelogio() {
  const agora = new Date()
  document.getElementById('data-hora').textContent = agora.toLocaleString('pt-BR')
}

function formatarNumero(n) {
  if (n >= 1e12) return '$' + (n / 1e12).toFixed(2) + 'T'
  if (n >= 1e9)  return '$' + (n / 1e9).toFixed(2) + 'B'
  if (n >= 1e6)  return '$' + (n / 1e6).toFixed(2) + 'M'
  return '$' + n.toLocaleString()
}


async function abrirModal(moeda) {
  const modal = document.getElementById('modal')
  const info = document.getElementById('modal-info')

  info.innerHTML = '<p style="color:#8b949e">Carregando detalhes...</p>'
  modal.style.display = 'flex'

  const resposta = await fetch(`https://api.coingecko.com/api/v3/coins/${moeda.id}`)
  const detalhes = await resposta.json()

  info.innerHTML = `
    <div style="display:flex; align-items:center; gap:12px; margin-bottom:24px">
      <img src="${detalhes.image.large}" width="48">
      <div>
        <h2>${detalhes.name} <span style="color:#8b949e; font-size:14px">${detalhes.symbol.toUpperCase()}</span></h2>
        <p style="color:#8b949e; font-size:13px">Rank #${detalhes.market_cap_rank}</p>
      </div>
    </div>

    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap:12px; margin-bottom:20px">
      <div style="background:#0d1117; padding:12px; border-radius:8px">
        <p style="color:#8b949e; font-size:11px; margin-bottom:4px">PREÇO ATUAL</p>
        <p style="font-weight:bold">$${detalhes.market_data.current_price.usd.toLocaleString()}</p>
      </div>
      <div style="background:#0d1117; padding:12px; border-radius:8px">
        <p style="color:#8b949e; font-size:11px; margin-bottom:4px">MARKET CAP</p>
        ${formatarNumero(detalhes.market_data.market_cap.usd)}
      </div>
      <div style="background:#0d1117; padding:12px; border-radius:8px">
        <p style="color:#8b949e; font-size:11px; margin-bottom:4px">VOLUME 24H</p>
        ${formatarNumero(detalhes.market_data.total_volume.usd)}

      </div>
      <div style="background:#0d1117; padding:12px; border-radius:8px">
        ${formatarNumero(detalhes.market_data.ath.usd)}
        <p style="font-weight:bold">$${detalhes.market_data.ath.usd.toLocaleString()}</p>
      </div>
    </div>
  `
}

document.getElementById('fechar-modal').addEventListener('click', function() {
  document.getElementById('modal').style.display = 'none'
})

buscarMoedas()
atualizarRelogio()
setInterval(buscarMoedas, 60000)
setInterval(atualizarRelogio, 1000)

document.getElementById('busca').addEventListener('input', function() {
  const texto = this.value.toLowerCase()
  const linhas = document.querySelectorAll('#lista-moedas tr')

  linhas.forEach(function(linha) {
    const nome = linha.cells[1].textContent.toLowerCase()
    if (nome.includes(texto)) {
      linha.style.display = ''
    } else {
      linha.style.display = 'none'
    }
  })
})