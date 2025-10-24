import { Proveedor } from '../models/Proveedor.js';

// Crear proveedor
export const crearProveedor = async (req, res) => {
  try {
    const proveedor = await Proveedor.create(req.body);
    res.status(201).json({ msg: 'Proveedor creado', proveedor });
  } catch (error) {
    res.status(500).json({ msg: 'Error al crear proveedor', error: error.message });
  }
};

// Listar proveedores
export const listarProveedores = async (req, res) => {
  try {
    const proveedores = await Proveedor.findAll();
    res.json(proveedores);
  } catch (error) {
    res.status(500).json({ msg: 'Error al listar proveedores', error: error.message });
  }
};
