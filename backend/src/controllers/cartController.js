// src/controllers/cartController.js
import { Carrito, CarritoItem, Producto } from '../models/index.js';

export const getCart = async (req, res) => {
  const carrito = await Carrito.findOrCreate({ where: { id_usuario: req.user.id }});
  const items = await CarritoItem.findAll({
    where: { id_carrito: carrito[0].id_carrito },
    include: [{ model: Producto, attributes: ['nombre','precio','id_producto'] }]
  });
  res.json({ id_carrito: carrito[0].id_carrito, items });
};

export const addItem = async (req, res) => {
  const { id_producto, cantidad } = req.body;
  const [carrito] = await Carrito.findOrCreate({ where: { id_usuario: req.user.id }});
  const prod = await Producto.findByPk(id_producto);
  if (!prod) return res.status(404).json({ msg: 'Producto no encontrado' });

  const existente = await CarritoItem.findOne({ where: { id_carrito: carrito.id_carrito, id_producto }});
  if (existente) {
    existente.cantidad += Number(cantidad);
    await existente.save();
    return res.json(existente);
  }
  const item = await CarritoItem.create({
    id_carrito: carrito.id_carrito,
    id_producto,
    cantidad,
    precio_unitario: prod.precio
  });
  res.status(201).json(item);
};

export const updateItem = async (req, res) => {
  const { id_item } = req.params;
  const { cantidad } = req.body;
  const item = await CarritoItem.findByPk(id_item);
  if (!item) return res.status(404).json({ msg: 'Item no encontrado' });
  item.cantidad = Number(cantidad);
  await item.save();
  res.json(item);
};

export const removeItem = async (req, res) => {
  const { id_item } = req.params;
  await CarritoItem.destroy({ where: { id_item }});
  res.json({ msg: 'Item eliminado' });
};

export const clearCart = async (req, res) => {
  const [carrito] = await Carrito.findOrCreate({ where: { id_usuario: req.user.id }});
  await CarritoItem.destroy({ where: { id_carrito: carrito.id_carrito }});
  res.json({ msg: 'Carrito vaciado' });
};
