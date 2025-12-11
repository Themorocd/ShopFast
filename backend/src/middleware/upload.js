import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carpeta uploads en la raíz de backend
const uploadPath = path.join(__dirname, '../../uploads');

// Crear carpeta si no existe
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log('📂 Carpeta de uploads creada en:', uploadPath);
} else {
  console.log('📂 Carpeta de uploads existente en:', uploadPath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext); // p.e. 173379147812-224821433.webp
  },
});

const upload = multer({ storage });

export default upload;
