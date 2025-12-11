// Importo los modelos de mi base de datos. Aquí tengo:
// - Producto
// - Categoria
// - Proveedor
// Estos modelos representan sus tablas correspondientes en MySQL.
import { Producto } from '../models/Producto.js';
import { Categoria } from '../models/Categoria.js';
import { Proveedor } from '../models/Proveedor.js';


// =======================================
// 📦 SECCIÓN DE PRODUCTOS
// =======================================

// LISTAR PRODUCTOS → Devuelvo todos los productos con su categoría y proveedor
export const listarProductos = async (req, res) => {
  try {
    // Busco todos los productos e incluyo los datos de la categoría y el proveedor.
    const productos = await Producto.findAll({
      include: [
        {
          model: Categoria,
          as: 'categoria',
          attributes: ['nombre'], // Solo quiero mostrar el nombre, no todo el objeto
        },
        {
          model: Proveedor,
          as: 'proveedor',
          attributes: ['nombre'], // Igual aquí
        },
      ],
    });

    // Devuelvo la lista al frontend
    res.json(productos);
  } catch (error) {
    console.error('❌ Error al listar productos:', error);
    res.status(500).json({
      msg: 'Error al listar productos',
      error: error.message,
    });
  }
};


// CREAR PRODUCTO → Crea un producto nuevo con o sin imagen
export const crearProducto = async (req, res) => {
  try {
    // Recojo los datos enviados desde el formulario
    const { nombre, precio, stock, id_categoria, id_proveedor } = req.body;

    // Si llega una imagen subida con Multer, la guardo.
    // Si no, simplemente será null.
    const imagen = req.file ? `/uploads/${req.file.filename}` : null;

    // Creo el producto en la base de datos
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
    res.status(500).json({
      msg: 'Error al crear producto',
      error: error.message,
    });
  }
};


// ACTUALIZAR PRODUCTO → Actualizo un producto, con posibilidad de cambiar o no la imagen
export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    // OJO: Si los datos vienen desde un FormData, todo llega como string.
    const {
      nombre,
      precio,
      stock,
      id_categoria,
      id_proveedor,
      imagenActual,
    } = req.body;

    // Busco el producto a actualizar
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }

    // Lógica para saber qué imagen usar al actualizar:
    // 1. Si llega una imagen nueva → la uso
    // 2. Si no llega pero hay imagenActual → mantengo la que había
    // 3. Si no hay ninguna → null
    let nuevaImagen = producto.imagen || null;

    if (req.file) {
      nuevaImagen = `/uploads/${req.file.filename}`;
    } else if (imagenActual) {
      nuevaImagen = imagenActual;
    }

    // Actualizo los valores
    producto.nombre = nombre;
    producto.precio = precio;
    producto.stock = stock;
    producto.id_categoria = id_categoria;
    producto.id_proveedor = id_proveedor;
    producto.imagen = nuevaImagen;

    // Guardo los cambios
    await producto.save();

    res.status(200).json({
      msg: 'Producto actualizado correctamente',
      data: producto,
    });
  } catch (error) {
    console.error('❌ Error al actualizar el producto:', error);
    res.status(500).json({
      msg: 'Error al actualizar el producto',
      error: error.message,
    });
  }
};


// ELIMINAR PRODUCTO → Borra un producto por su ID
export const eliminarProducto = async (req, res) => {
  try {
    await Producto.destroy({
      where: { id_producto: req.params.id },
    });

    res.json({ msg: 'Eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar producto:', error);
    res.status(500).json({
      msg: 'Error al eliminar producto',
      error: error.message,
    });
  }
};



// =======================================
// 🧩 SECCIÓN DE CATEGORÍAS
// =======================================

// LISTAR TODAS LAS CATEGORÍAS
export const listarCategorias = async (req, res) =>
  res.json(await Categoria.findAll());

// CREAR UNA CATEGORÍA NUEVA
export const crearCategoria = async (req, res) =>
  res.json(await Categoria.create(req.body));

// ACTUALIZAR CATEGORÍA
export const actualizarCategoria = async (req, res) => {
  await Categoria.update(req.body, {
    where: { id_categoria: req.params.id },
  });
  res.json({ msg: 'Categoría actualizada' });
};

// ELIMINAR CATEGORÍA
export const eliminarCategoria = async (req, res) => {
  await Categoria.destroy({
    where: { id_categoria: req.params.id },
  });
  res.json({ msg: 'Categoría eliminada' });
};



// =======================================
// 🚚 SECCIÓN DE PROVEEDORES
// =======================================

// LISTAR PROVEEDORES
export const listarProveedores = async (req, res) => {
  try {
    const proveedores = await Proveedor.findAll();
    res.json(proveedores);
  } catch (error) {
    res.status(500).json({
      msg: 'Error al listar proveedores',
      error: error.message,
    });
  }
};

// CREAR PROVEEDOR
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
    res.status(500).json({
      msg: 'Error al crear proveedor',
      error: error.message,
    });
  }
};

// ACTUALIZAR PROVEEDOR
export const actualizarProveedor = async (req, res) => {
  await Proveedor.update(req.body, {
    where: { id_proveedor: req.params.id },
  });
  res.json({ msg: 'Proveedor actualizado' });
};

// ELIMINAR PROVEEDOR
export const eliminarProveedor = async (req, res) => {
  await Proveedor.destroy({
    where: { id_proveedor: req.params.id },
  });
  res.json({ msg: 'Proveedor eliminado' });
};
