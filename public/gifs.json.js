const fs = require('fs');
const path = require('path');

const gifsDir = path.join(__dirname, 'frontend', 'public', 'gifs');
const outputFile = path.join(__dirname, 'frontend', 'public', 'gifs.json');

const arquivos = fs.readdirSync(gifsDir);
const resultado = {};

arquivos.forEach((arquivo) => {
  const nome = path.basename(arquivo, '.gif');
  const chave = nome.replace(/[0-9]/g, '').toLowerCase(); // Ex: agachamento1 → agachamento
  if (!resultado[chave]) resultado[chave] = [];
  resultado[chave].push(arquivo);
});

fs.writeFileSync(outputFile, JSON.stringify(resultado, null, 2));
console.log('✅ gifs.json gerado com sucesso!');