import { Producto } from '../models/Producto.js';


// ======================================================================
// 🟢 CREAR PRODUCTO
// ======================================================================
// Esta función crea un nuevo producto usando los datos que vienen del body.
// Aquí se usa directamente req.body porque el modelo ya valida lo necesario.
export const crearProducto = async (req, res) => {
  try {
    // Creo el producto en la base de datos
    const producto = await Producto.create(req.body);

    // Devuelvo un mensaje de éxito y el producto creado
    res.status(201).json({
      msg: 'Producto creado correctamente',
      producto
    });

  } catch (error) {
    // Si algo falla, devuelvo un error genérico
    res.status(500).json({
      msg: 'Error al crear el producto',
      error: error.message
    });
  }
};



// ======================================================================
// 🔵 LISTAR PRODUCTOS
// ======================================================================
// Aquí devuelvo TODOS los productos de la base de datos sin filtros.
// Es ideal para la tienda o para un panel admin básico.
export const listarProductos = async (req, res) => {
  try {
    // Obtengo todos los productos registrados
    const productos = await Producto.findAll();

    // Los mando al frontend
    res.json(productos);

  } catch (error) {
    res.status(500).json({
      msg: 'Error al obtener productos',
      error: error.message
    });
  }
};



// ======================================================================
// ✏️ ACTUALIZAR PRODUCTO
// ======================================================================
// Esta función busca un producto por ID, y si existe lo actualiza con los datos del body.
export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    // Busco el producto por su ID
    const producto = await Producto.findByPk(id);

    // Si no existe, devuelvo error
    if (!producto)
      return res.status(404).json({ msg: 'Producto no encontrado' });

    // Actualizo el producto con los nuevos datos
    await producto.update(req.body);

    // Devuelvo la respuesta de éxito
    res.json({
      msg: 'Producto actualizado correctamente',
      producto
    });

  } catch (error) {
    res.status(500).json({
      msg: 'Error al actualizar el producto',
      error: error.message
    });
  }
};



// ======================================================================
// ❌ ELIMINAR PRODUCTO
// ======================================================================
// Esta función elimina completamente un producto por su ID.
export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    // Busco el producto
    const producto = await Producto.findByPk(id);

    // Si no existe → error
    if (!producto)
      return res.status(404).json({ msg: 'Producto no encontrado' });

    // Elimino el producto
    await producto.destroy();

    res.json({ msg: 'Producto eliminado correctamente' });

  } catch (error) {
    res.status(500).json({
      msg: 'Error al eliminar el producto',
      error: error.message
    });
  }
};
