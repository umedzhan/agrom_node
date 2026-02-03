# Agrom E-commerce Backend

Agrom E-commerce platformasi uchun Backend API. Node.js, Express va MongoDB yordamida qurilgan.

## Mundarija

- [Umumiy Ma'lumot](#umumiy-malumot)
- [Texnologiyalar](#texnologiyalar)
- [Boshlash](#boshlash)
- [API Endpointlari](#api-endpointlari)

## Umumiy Ma'lumot

Bu Agrom E-commerce ilovasi uchun RESTful API serveri. U foydalanuvchi autentifikatsiyasi, mahsulotlarni boshqarish, buyurtmalarni qayta ishlash va rasmlarni yuklash vazifalarini bajaradi.

## Texnologiyalar

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Ma'lumotlar bazasi**: [MongoDB](https://www.mongodb.com/) va [Mongoose](https://mongoosejs.com/)
- **Autentifikatsiya**: JWT (JSON Web Tokens)
- **Rasmlar bilan ishlash**: Multer

## Boshlash

### Talablar

- Node.js (v14 yoki undan yuqori)
- NPM yoki Yarn
- MongoDB (lokal yoki Atlas)

### O'rnatish

1.  Repozitoriyni klonlash:
    ```bash
    git clone <repository-url>
    cd backend
    ```

2.  Kutubxonalarni o'rnatish:
    ```bash
    npm install
    ```

3.  Atrof-muhit o'zgaruvchilarini sozlash:
    Ildiz papkasida `.env` faylini yarating va quyidagilarni qo'shing:
    ```env
    NODE_ENV=development
    PORT=5000
    MONGO_URI=sizning_mongodb_ulanish_manzilingiz
    JWT_SECRET=sizning_jwt_maxfiy_kalitingiz
    ```

### Serverni ishga tushirish

- **Development rejimi** (nodemon bilan):
    ```bash
    npm run dev
    ```

- **Production rejimi**:
    ```bash
    npm start
    ```

- **Ma'lumotlarni kiritish (Seeder)**:
    Namunaviy ma'lumotlarni yuklash uchun:
    ```bash
    npm run data:import
    ```
    Ma'lumotlarni o'chirish uchun:
    ```bash
    npm run data:destroy
    ```

## API Endpointlari

### Autentifikatsiya

| Metod | Endpoint | Tavsif | Kirish |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Tizimga kirish va token olish | Ochiq |
| `POST` | `/api/auth` | Ro'yxatdan o'tish | Ochiq |
| `GET` | `/api/auth/profile` | Profil ma'lumotlarini olish | Yopiq |

### Mahsulotlar

| Metod | Endpoint | Tavsif | Kirish |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Barcha mahsulotlarni olish | Ochiq |
| `GET` | `/api/products/:id` | Bitta mahsulotni olish | Ochiq |
| `POST` | `/api/products` | Mahsulot yaratish | Yopiq/Admin |
| `PUT` | `/api/products/:id` | Mahsulotni yangilash | Yopiq/Admin |
| `DELETE` | `/api/products/:id` | Mahsulotni o'chirish | Yopiq/Admin |

### Buyurtmalar

| Metod | Endpoint | Tavsif | Kirish |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Yangi buyurtma yaratish | Yopiq |
| `GET` | `/api/orders/:id` | ID bo'yicha buyurtmani olish | Yopiq |

### Yuklamalar

| Metod | Endpoint | Tavsif | Kirish |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/upload` | Rasm yuklash | Ochiq |

## Litsenziya

Barcha huquqlar himoyalangan. Agrom E-commerce platformasi uchun Backend API.