import { Proveedor } from '../models/Proveedor.js';


// =======================================================================
// 🟢 CREAR PROVEEDOR
// =======================================================================
// Esta función crea un nuevo proveedor usando los datos enviados desde el frontend.
// El body debería contener los campos que definí en mi modelo (nombre, teléfono, categoría, etc.)
export const crearProveedor = async (req, res) => {
  try {
    // Creo el proveedor directamente en la base de datos.
    // Sequelize se encarga de validar que las columnas existan y coincidan.
    const proveedor = await Proveedor.create(req.body);

    // Devuelvo respuesta de éxito junto con el proveedor creado
    res.status(201).json({
      msg: 'Proveedor creado',
      proveedor
    });

  } catch (error) {
    // Si ocurre algún error (validación, campos incorrectos, BD caída, etc.)
    res.status(500).json({
      msg: 'Error al crear proveedor',
      error: error.message
    });
  }
};



// =======================================================================
// 🔵 LISTAR PROVEEDORES
// =======================================================================
// Esta función devuelve un listado completo de todos los proveedores registrados.
export const listarProveedores = async (req, res) => {
  try {
    // Obtengo todos los proveedores sin filtros
    const proveedores = await Proveedor.findAll();

    // Se los envío al frontend en formato JSON
    res.json(proveedores);

  } catch (error) {
    res.status(500).json({
      msg: 'Error al listar proveedores',
      error: error.message
    });
  }
};
