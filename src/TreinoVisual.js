import React, { useRef, useState } from 'react';
import './TreinoVisual.css';

const LOGO_FILENAME = 'Rodolfo_Logo.png'; 

const TreinoVisual = ({ lista, alunoNome, observacoes, onClose, isModoVisualizacao }) => {
    const treinoRef = useRef();
    const [textoBotao, setTextoBotao] = useState('Gerar Link Curto');

    const handleSaveAndLink = async () => {
        setTextoBotao('Gerando...');
        const dadosDoTreino = { lista, alunoNome, observacoes };
        
        try {
            // Passo 1: Enviar os dados para o "cofre" na nuvem
            const response = await fetch('/api/salvarTreino', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosDoTreino),
            });

            if (!response.ok) throw new Error('Falha ao salvar o treino.');

            const { id } = await response.json();
            const linkFinal = `${window.location.origin}/treino/${id}`;
            const mensagemParaCopiar = `Olá, ${alunoNome || 'aluno(a)'}! Segue o seu treino personalizado. Clique para visualizar:\n\n${linkFinal}`;
            
            // Passo 2: Copiar a mensagem com o link curto
            navigator.clipboard.writeText(mensagemParaCopiar).then(() => {
                setTextoBotao('✅ Link Copiado!');
                setTimeout(() => setTextoBotao('Gerar Link Curto'), 2500);
            });
        } catch (error) {
            console.error("Erro ao salvar o treino:", error);
            alert("Ocorreu um erro ao gerar o link. Este recurso só funciona com o site publicado.");
            setTextoBotao('Gerar Link Curto');
        }
    };

    const conteudoTreino = (
        <div ref={treinoRef} className="container-treino">
            <header className="cabecalho-treino-novo">
                <div className="cabecalho-texto">
                    <h2>Rodolfo Ferraz</h2>
                    <p className="subtitulo-personal">Personal Trainer</p>
                    <p className="nome-aluno"><strong>Aluno(a):</strong> {alunoNome || '____________________'}</p>
                </div>
                <div className="cabecalho-logo">
                    <img src={`/${LOGO_FILENAME}`} alt="Logo Personal Trainer" className="logo-img" />
                </div>
            </header>
            <main className="grid-exercicios">
                {(lista || []).map((ex, index) => (
                    <div key={index} className="card-exercicio">
                        <span className="numero-exercicio">{index + 1}</span>
                        <img src={`/gifs/${ex.gif}`} alt={ex.nome} className="gif-exercicio" />
                        <p className="nome-exercicio"><strong>{ex.nome}</strong></p>
                        <p className="serie-exercicio">3x10 rep</p>
                    </div>
                ))}
            </main>
            <footer className="rodape-treino-novo">
                <h3>Observações:</h3>
                <p className="observacoes-texto">{observacoes || 'Nenhuma.'}</p>
            </footer>
        </div>
    );

    // Se for modo de visualização, mostra apenas o treino
    if (isModoVisualizacao) {
        return conteudoTreino;
    }

    // Se for modo de criação, mostra o modal completo
    return (
        <div>
            <div className="modal-header">
                <h2>Pré-visualização e Compartilhamento</h2>
                <button onClick={onClose} className="close-button">&times;</button>
            </div>
            <div className="modal-actions">
                <button onClick={handleSaveAndLink} className="export-button">
                    {textoBotao}
                </button>
            </div>
            {conteudoTreino}
        </div>
    );
};

export default TreinoVisual;