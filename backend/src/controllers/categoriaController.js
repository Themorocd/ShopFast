import { Categoria } from '../models/Categoria.js';

// Crear categoría
export const crearCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.create(req.body);
    res.status(201).json({ msg: 'Categoría creada', categoria });
  } catch (error) {
    res.status(500).json({ msg: 'Error al crear categoría', error: error.message });
  }
};

// Listar categorías
export const listarCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ msg: 'Error al listar categorías', error: error.message });
  }
};
