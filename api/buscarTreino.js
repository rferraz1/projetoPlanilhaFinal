const { kv } = require('@vercel/kv');

module.exports = async (req, res) => {
  // Pega o ID da URL (ex: /api/buscarTreino?id=a3x8b1)
  const { id } = req.query;
  try {
    // Busca o treino no "cofre" da Vercel usando o ID
    const treino = await kv.get(id);
    
    if (treino) {
      // Se encontrou, retorna os dados do treino
      return res.status(200).json(treino);
    } else {
      // Se não encontrou, retorna um erro 404
      return res.status(404).json({ message: 'Treino não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao buscar no Vercel KV:', error);
    return res.status(500).json({ error: error.message });
  }
};