[README_ShopFast.md](https://github.com/user-attachments/files/23133456/README_ShopFast.md)
# 🛍️ ShopFast — Tienda Online FullStack
**Proyecto desarrollado por:** *Andrés José Marín Pascualvaca*  

## 📖 Descripción
ShopFast es una aplicación web FullStack inspirada en Aliexpress.  
Permite a los usuarios:
- Navegar productos sin necesidad de registrarse.  
- Crear una cuenta y confirmar su correo electrónico.  
- Iniciar sesión y acceder a su perfil.  
- Añadir productos al carrito y realizar pedidos.  

Incluye además un **panel de administración** para gestionar productos, categorías y proveedores, completamente conectado con la base de datos.

---

## 🧱 Estructura del Proyecto
```
ShopFast/
├── backend/        # Servidor Node.js con Express y Sequelize
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── index.js
│   └── package.json
│
├── frontend/       # Aplicación Angular 17 standalone
│   ├── src/app/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── assets/
│   │   └── main.ts
│   └── package.json
│
└── README.md
```

---

## ⚙️ Tecnologías utilizadas
**Frontend:** Angular 17, HTML5, CSS3, Bootstrap 5  
**Backend:** Node.js, Express.js, Sequelize ORM  
**Base de datos:** MySQL (phpMyAdmin con XAMPP)  
**Autenticación:** JWT, bcrypt, Nodemailer  
**Paradigma:** Modelo–Vista–Controlador (MVC)

---

## 🚀 Instalación y ejecución

### 🔹 Clonar el repositorio
```bash
git clone https://github.com/tu_usuario/ShopFast.git
cd ShopFast
```

### 🔹 Configurar el backend
```bash
cd backend
npm install
```

Crea un archivo `.env` con:
```
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=shopfast
JWT_SECRET=tu_clave_jwt
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_contraseña_o_contraseña_de_app
```

Inicia el servidor:
```bash
npm run dev
```

### 🔹 Configurar el frontend
```bash
cd ../frontend
npm install
ng serve
```

La aplicación estará disponible en:  
👉 **Frontend:** http://localhost:4200  
👉 **Backend API:** http://localhost:3000  

---

## 🧑‍💻 Funcionalidades principales
### 🔹 Usuario
- Registro con verificación por correo electrónico.  
- Login y autenticación JWT.  
- Perfil de usuario y gestión de pedidos.  

### 🔹 Administrador
- CRUD completo de productos, categorías y proveedores.  
- Asociación de productos con su categoría y proveedor.  
- Eliminación segura con confirmación.  

### 🔹 General
- Paleta de colores moderna (verde menta, blanco, azul oscuro).  
- Diseño responsive con Bootstrap.  
- Estructura modular y escalable.

---

## 📦 Estado actual
✅ Backend funcional con MySQL y Sequelize  
✅ Frontend Angular con login, registro y panel de administración  
✅ Envío de correos de verificación  
✅ Integración completa API–frontend  

---

## 🧾 Autor
**Andrés José Marín Pascualvaca**  
Proyecto final del ciclo **Desarrollo de Aplicaciones Web (DAW)**  
IES Mar de Cádiz — 2025


paypal; sb-yh4fp48097551@personal.example.com
pass: E5U$g55_
https://developer.paypal.com/dashboard/accounts/edit/4822241966657708620?accountName=sb-yh4fp48097551@personal.example.com
usuario: paypalproyecto@gmail.com
pass: ya sabes, la corta
shopfast053@gmail.com
