// gerar-mapa-gifs.js (VERSÃO CORRIGIDA)
const fs = require('fs');
const path = require('path');

const gifsDirectory = path.join(__dirname, 'public', 'gifs');
const outputFile = path.join(__dirname, 'public', 'gifs.json');

const finalStructure = {};

function findGifsInDir(directory) {
    const files = fs.readdirSync(directory);

    files.forEach(file => {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            findGifsInDir(fullPath); // Se for uma pasta, continua a busca nela
        } else if (path.extname(file).toLowerCase() === '.gif') {
            const exerciseName = path.basename(file, '.gif');
            // MUDANÇA CRUCIAL: Agora guardamos o caminho relativo (ex: 'Peito/Supino.gif')
            const relativePath = path.relative(gifsDirectory, fullPath).replace(/\\/g, '/');

            // Adiciona ao mapa, agrupado por palavras-chave
            const keywords = exerciseName.toLowerCase().split(/[\s-]+/);
            keywords.forEach(keyword => {
                if (!finalStructure[keyword]) {
                    finalStructure[keyword] = [];
                }
                if (!finalStructure[keyword].includes(relativePath)) {
                    finalStructure[keyword].push(relativePath);
                }
            });
        }
    });
}

console.log('🤖 Mapeando sua nova estrutura de GIFs com subpastas...');
findGifsInDir(gifsDirectory);

fs.writeFileSync(outputFile, JSON.stringify(finalStructure, null, 2));

const totalGifs = Object.values(finalStructure).flat().filter((v, i, a) => a.indexOf(v) === i).length;
console.log(`✅ Mapa-mestre criado com sucesso em 'public/gifs.json' com ${totalGifs} exercícios!`);