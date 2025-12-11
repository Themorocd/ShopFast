// backend/src/controllers/adminController.js
import { Producto } from '../models/Producto.js';
import { Categoria } from '../models/Categoria.js';
import { Proveedor } from '../models/Proveedor.js';

// =======================
// 📦 PRODUCTOS
// =======================

// LISTAR PRODUCTOS (con nombre de categoría y proveedor)
export const listarProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      include: [
        {
          model: Categoria,
          as: 'categoria',
          attributes: ['nombre'],
        },
        {
          model: Proveedor,
          as: 'proveedor',
          attributes: ['nombre'],
        },
      ],
    });
    res.json(productos);
  } catch (error) {
    console.error('❌ Error al listar productos:', error);
    res
      .status(500)
      .json({ msg: 'Error al listar productos', error: error.message });
  }
};

// CREAR PRODUCTO (con imagen opcional)
export const crearProducto = async (req, res) => {
  try {
    const { nombre, precio, stock, id_categoria, id_proveedor } = req.body;

    // Si se ha subido una imagen, la guardamos como /uploads/archivo.ext
    const imagen = req.file ? `/uploads/${req.file.filename}` : null;

    const nuevo = await Producto.create({
      nombre,
      precio,
      stock,
      id_categoria,
      id_proveedor,
      imagen,
    });

    res.status(201).json(nuevo);
  } catch (error) {
    console.error('❌ Error al crear producto:', error);
    res
      .status(500)
      .json({ msg: 'Error al crear producto', error: error.message });
  }
};

// ACTUALIZAR PRODUCTO (con imagen opcional)
export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    // OJO: al venir de FormData, todo llega como string
    const {
      nombre,
      precio,
      stock,
      id_categoria,
      id_proveedor,
      imagenActual,
    } = req.body;

    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }

    // Determinar qué imagen usar:
    // - Si hay nueva imagen en req.file → usamos esa
    // - Si no, usamos imagenActual (la que ya tenía el producto)
    // - Si tampoco, la dejamos en null
    let nuevaImagen = producto.imagen || null;

    if (req.file) {
      nuevaImagen = `/uploads/${req.file.filename}`;
    } else if (imagenActual) {
      nuevaImagen = imagenActual;
    }

    producto.nombre = nombre;
    producto.precio = precio;
    producto.stock = stock;
    producto.id_categoria = id_categoria;
    producto.id_proveedor = id_proveedor;
    producto.imagen = nuevaImagen;

    await producto.save();

    res
      .status(200)
      .json({ msg: 'Producto actualizado correctamente', data: producto });
  } catch (error) {
    console.error('❌ Error al actualizar el producto:', error);
    res.status(500).json({
      msg: 'Error al actualizar el producto',
      error: error.message,
    });
  }
};

export const eliminarProducto = async (req, res) => {
  try {
    await Producto.destroy({ where: { id_producto: req.params.id } });
    res.json({ msg: 'Eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar producto:', error);
    res
      .status(500)
      .json({ msg: 'Error al eliminar producto', error: error.message });
  }
};

// =======================
// 🧩 CATEGORÍAS
// =======================

export const listarCategorias = async (req, res) =>
  res.json(await Categoria.findAll());

export const crearCategoria = async (req, res) =>
  res.json(await Categoria.create(req.body));

export const actualizarCategoria = async (req, res) => {
  await Categoria.update(req.body, {
    where: { id_categoria: req.params.id },
  });
  res.json({ msg: 'Categoría actualizada' });
};

export const eliminarCategoria = async (req, res) => {
  await Categoria.destroy({ where: { id_categoria: req.params.id } });
  res.json({ msg: 'Categoría eliminada' });
};

// =======================
// 🚚 PROVEEDORES
// =======================

export const listarProveedores = async (req, res) => {
  try {
    const proveedores = await Proveedor.findAll();
    res.json(proveedores);
  } catch (error) {
    res
      .status(500)
      .json({ msg: 'Error al listar proveedores', error: error.message });
  }
};

export const crearProveedor = async (req, res) => {
  try {
    const { nombre, telefono, id_categoria } = req.body;
    const nuevoProveedor = await Proveedor.create({
      nombre,
      telefono,
      id_categoria,
    });
    res.status(201).json(nuevoProveedor);
  } catch (error) {
    res
      .status(500)
      .json({ msg: 'Error al crear proveedor', error: error.message });
  }
};

export const actualizarProveedor = async (req, res) => {
  await Proveedor.update(req.body, { where: { id_proveedor: req.params.id } });
  res.json({ msg: 'Proveedor actualizado' });
};

export const eliminarProveedor = async (req, res) => {
  await Proveedor.destroy({ where: { id_proveedor: req.params.id } });
  res.json({ msg: 'Proveedor eliminado' });
};
