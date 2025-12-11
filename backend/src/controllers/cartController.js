// Importo los modelos que necesito para manejar el carrito:
// - Carrito → representa el carrito de un usuario
// - CarritoItem → representa cada producto dentro del carrito
// - Producto → para comprobar precios, existencia, etc.
import { Carrito, CarritoItem, Producto } from '../models/index.js';


// ======================================================
// 🛍️ GET CART → Obtener el carrito del usuario logueado
// ======================================================
export const getCart = async (req, res) => {

  // Busco el carrito del usuario. Si no existe, lo creo automáticamente.
  const carrito = await Carrito.findOrCreate({
    where: { id_usuario: req.user.id }
  });

  // Obtengo todos los items dentro del carrito, incluyendo la info del producto
  const items = await CarritoItem.findAll({
    where: { id_carrito: carrito[0].id_carrito },
    include: [
      {
        model: Producto,
        attributes: ['nombre', 'precio', 'id_producto'] // solo muestro lo necesario
      }
    ]
  });

  // Devuelvo el carrito y su contenido
  res.json({
    id_carrito: carrito[0].id_carrito,
    items
  });
};



// ======================================================
// ➕ ADD ITEM → Añadir un producto al carrito
// ======================================================
export const addItem = async (req, res) => {

  const { id_producto, cantidad } = req.body;

  // Busco o creo el carrito del usuario
  const [carrito] = await Carrito.findOrCreate({
    where: { id_usuario: req.user.id }
  });

  // Busco el producto real en la BD
  const prod = await Producto.findByPk(id_producto);
  if (!prod) return res.status(404).json({ msg: 'Producto no encontrado' });

  // Compruebo si el producto ya está dentro del carrito
  const existente = await CarritoItem.findOne({
    where: {
      id_carrito: carrito.id_carrito,
      id_producto
    }
  });

  // Si ya existe, simplemente aumento la cantidad
  if (existente) {
    existente.cantidad += Number(cantidad);
    await existente.save();
    return res.json(existente);
  }

  // Si no existe, creo un item nuevo
  const item = await CarritoItem.create({
    id_carrito: carrito.id_carrito,
    id_producto,
    cantidad,
    precio_unitario: prod.precio  // guardo el precio actual por si cambia luego
  });

  res.status(201).json(item);
};



// ======================================================
// ✏️ UPDATE ITEM → Cambiar la cantidad de un producto
// ======================================================
export const updateItem = async (req, res) => {

  const { id_item } = req.params;
  const { cantidad } = req.body;

  // Busco el item por su id
  const item = await CarritoItem.findByPk(id_item);
  if (!item) return res.status(404).json({ msg: 'Item no encontrado' });

  // Actualizo la cantidad
  item.cantidad = Number(cantidad);
  await item.save();

  res.json(item);
};



// ======================================================
// ❌ REMOVE ITEM → Eliminar un producto del carrito
// ======================================================
export const removeItem = async (req, res) => {

  const { id_item } = req.params;

  // Borro el item directamente
  await CarritoItem.destroy({
    where: { id_item }
  });

  res.json({ msg: 'Item eliminado' });
};



// ======================================================
// 🗑️ CLEAR CART → Vaciar por completo el carrito
// ======================================================
export const clearCart = async (req, res) => {

  // Busco el carrito del usuario o lo creo si no existiera (caso raro)
  const [carrito] = await Carrito.findOrCreate({
    where: { id_usuario: req.user.id }
  });

  // Elimino todos los items del carrito
  await CarritoItem.destroy({
    where: { id_carrito: carrito.id_carrito }
  });

  res.json({ msg: 'Carrito vaciado' });
};
