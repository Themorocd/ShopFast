import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Estas dos líneas sirven para poder usar __dirname en módulos ES (import/export)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =======================================================================
// 📁 DEFINO LA CARPETA "uploads" DONDE SE GUARDARÁN LAS IMÁGENES
// =======================================================================
// Aquí establezco la ruta de la carpeta "uploads" en la raíz del backend.
const uploadPath = path.join(__dirname, '../../uploads');

// =======================================================================
// 📂 SI LA CARPETA NO EXISTE, LA CREO AUTOMÁTICAMENTE
// =======================================================================
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log('📂 Carpeta de uploads creada en:', uploadPath);
} else {
  console.log('📂 Carpeta de uploads existente en:', uploadPath);
}

// =======================================================================
// 🧠 CONFIGURACIÓN DE MULTER PARA GUARDAR ARCHIVOS EN DISCO
// =======================================================================
// diskStorage permite personalizar:
// 1. dónde se guarda el archivo
// 2. con qué nombre se guarda
const storage = multer.diskStorage({

  // 📌 destination → la carpeta donde se guardará la imagen subida
  destination: (req, file, cb) => {
    cb(null, uploadPath); // uso la ruta configurada arriba
  },

  // 📌 filename → renombro la imagen para evitar conflictos
  filename: (req, file, cb) => {
    // Genero un nombre único usando timestamp + número random
    const uniqueSuffix =
      Date.now() + '-' + Math.round(Math.random() * 1e9);

    // Obtengo la extensión original del archivo (.jpg, .png, .webp…)
    const ext = path.extname(file.originalname);

    // Ejemplo final: "173379147812-224821433.webp"
    cb(null, uniqueSuffix + ext);
  },
});

// =======================================================================
// 🚀 EXPORTO EL MIDDLEWARE LISTO PARA USAR EN RUTAS
// =======================================================================
// upload.single('imagen')
// upload.single('foto')
// upload.single('avatar')
// etc.
const upload = multer({ storage });

export default upload;
