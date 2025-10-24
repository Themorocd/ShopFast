import { Producto } from '../models/Producto.js';

// 📦 Crear un nuevo producto
export const crearProducto = async (req, res) => {
  try {
    const producto = await Producto.create(req.body);
    res.status(201).json({ msg: 'Producto creado correctamente', producto });
  } catch (error) {
    res.status(500).json({ msg: 'Error al crear el producto', error: error.message });
  }
};

// 📋 Listar todos los productos
export const listarProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener productos', error: error.message });
  }
};

// ✏️ Actualizar producto
export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);

    if (!producto) return res.status(404).json({ msg: 'Producto no encontrado' });

    await producto.update(req.body);
    res.json({ msg: 'Producto actualizado correctamente', producto });
  } catch (error) {
    res.status(500).json({ msg: 'Error al actualizar el producto', error: error.message });
  }
};

// 🗑️ Eliminar producto
export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);

    if (!producto) return res.status(404).json({ msg: 'Producto no encontrado' });

    await producto.destroy();
    res.json({ msg: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al eliminar el producto', error: error.message });
  }
};
