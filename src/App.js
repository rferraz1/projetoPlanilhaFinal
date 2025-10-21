import React, { useState, useEffect } from 'react';
import TreinoVisual from './TreinoVisual';
import './Modal.css';

// Componente separado para o modo de criação
const CriadorDeTreino = () => {
    const [busca, setBusca] = useState('');
    const [gifsPorExercicio, setGifsPorExercicio] = useState({});
    const [lista, setLista] = useState([]);
    const [alunoNome, setAlunoNome] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [mostrarModal, setMostrarModal] = useState(false);

    useEffect(() => {
        fetch('/gifs.json')
            .then((res) => res.json())
            .then((data) => {
                const todosOsGifs = [...new Set(Object.values(data).flat())];
                setGifsPorExercicio({ ...data, todos: todosOsGifs });
            })
            .catch((err) => console.error('Erro ao carregar gifs.json:', err));
    }, []);

    const gifsEncontrados = gifsPorExercicio[busca.toLowerCase()] || [];

    const adicionarExercicio = (gifPath) => {
        if (lista.length >= 9) { alert('Máximo de 9 exercícios.'); return; }
        const nomeDoExercicio = gifPath.split('/').pop().replace('.gif', '');
        setLista([...lista, { nome: nomeDoExercicio, gif: gifPath }]);
        setBusca('');
    };

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h1 style={{ textAlign: 'center' }}>Montar Treino</h1>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <h3>Adicione manualmente:</h3>
                    <input type="text" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Digite para buscar um exercício..." style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }} />
                    <div style={{ marginTop: '1rem' }}>
                        {gifsEncontrados.map((gifPath, i) => (
                            <img key={i} src={`/gifs/${gifPath}`} alt={gifPath} width="200" style={{ cursor: 'pointer', margin: '0.5rem', borderRadius: '8px' }} onClick={() => adicionarExercicio(gifPath)} />
                        ))}
                    </div>
                </div>
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <h2>Dados do Treino</h2>
                    <label>Nome do Aluno(a):</label>
                    <input type="text" value={alunoNome} onChange={(e) => setAlunoNome(e.target.value)} style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }} />
                    <label>Observações:</label>
                    <textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} style={{ width: '100%', minHeight: '80px', padding: '0.5rem', marginBottom: '1rem' }} />
                    <h3>Exercícios Adicionados ({lista.length} / 9)</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {lista.map((item, index) => (
                            <li key={index} style={{ fontSize: '1.1rem', marginBottom: '0.75rem', padding: '0.5rem', background: '#f0f0f0', borderRadius: '6px' }}>
                                <strong>{item.nome}</strong>
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => setMostrarModal(true)} style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', fontSize: '1rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                        Visualizar e Gerar Link
                    </button>
                </div>
            </div>
            {mostrarModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <TreinoVisual 
                            lista={lista} 
                            alunoNome={alunoNome}
                            observacoes={observacoes}
                            onClose={() => setMostrarModal(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

// Componente principal que decide o que mostrar: o criador ou o visualizador
function App() {
    const [modo, setModo] = useState('carregando'); // carregando, criador, visualizador
    const [dadosTreino, setDadosTreino] = useState(null);

    useEffect(() => {
        const path = window.location.pathname.split('/');
        if (path[1] === 'treino' && path[2]) {
            const treinoId = path[2];
            setModo('visualizador');
            fetch(`/api/buscarTreino?id=${treinoId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.error || !data.lista) throw new Error(data.message || 'Dados do treino inválidos');
                    setDadosTreino(data);
                })
                .catch(err => {
                    console.error("Erro ao buscar treino:", err);
                    setDadosTreino(null); // Garante que não mostre um treino quebrado
                });
        } else {
            setModo('criador');
        }
    }, []);

    if (modo === 'carregando') {
        return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Carregando...</div>;
    }

    if (modo === 'visualizador') {
        if (!dadosTreino) {
            return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Treino não encontrado ou inválido.</div>;
        }
        return (
            <div style={{ padding: '1rem' }}>
                <TreinoVisual 
                    lista={dadosTreino.lista} 
                    alunoNome={dadosTreino.alunoNome} 
                    observacoes={dadosTreino.observacoes} 
                    isModoVisualizacao={true}
                />
            </div>
        );
    }

    // Por padrão, mostra o criador de treinos
    return <CriadorDeTreino />;
}

export default App;