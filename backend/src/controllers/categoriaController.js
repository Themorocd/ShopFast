// Importo el modelo Categoria, que representa la tabla 'categorias' en la base de datos.
// Con este modelo puedo crear, buscar, actualizar o borrar categorías.
import { Categoria } from '../models/Categoria.js';


// ==========================================
// 🟢 CREAR CATEGORÍA
// ==========================================
export const crearCategoria = async (req, res) => {
  try {
    // Creo una nueva categoría usando los datos enviados en el body.
    // req.body debería venir con { nombre: "...", descripcion: "..." } o lo que yo haya definido.
    const categoria = await Categoria.create(req.body);

    // Devuelvo respuesta de éxito
    res.status(201).json({
      msg: 'Categoría creada',
      categoria
    });

  } catch (error) {
    // Si falla algo (campos inválidos, error de BD, etc.)
    res.status(500).json({
      msg: 'Error al crear categoría',
      error: error.message
    });
  }
};



// ==========================================
// 🔵 LISTAR CATEGORÍAS
// ==========================================
export const listarCategorias = async (req, res) => {
  try {
    // Obtengo todas las categorías de la base de datos
    const categorias = await Categoria.findAll();

    // Las devuelvo en formato JSON al frontend
    res.json(categorias);

  } catch (error) {
    // Si ocurre un error durante la consulta
    res.status(500).json({
      msg: 'Error al listar categorías',
      error: error.message
    });
  }
};
