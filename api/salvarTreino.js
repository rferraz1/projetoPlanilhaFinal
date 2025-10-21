const { kv } = require('@vercel/kv');

module.exports = async (req, res) => {
  // Garante que apenas o método POST seja usado
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }
  try {
    // Gera um ID curto, aleatório e em minúsculas (ex: 'a3x8b1')
    const id = Math.random().toString(36).substring(2, 8).toLowerCase();
    const treino = req.body;
    
    // Salva o treino no "cofre" da Vercel usando o ID como chave
    await kv.set(id, JSON.stringify(treino));
    
    // Retorna o ID para o aplicativo
    return res.status(200).json({ id: id });
  } catch (error) {
    console.error('Erro ao salvar no Vercel KV:', error);
    return res.status(500).json({ error: error.message });
  }
};