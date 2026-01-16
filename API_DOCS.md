# Frontend API Documentation

This guide details how to consume the Agrom Backend API.

## Base URL
All API requests should be prefixed with `/api`.
Example: `http://localhost:5000/api/products`

## Authentication
Protected routes require a valid JWT token in the request header.
**Header:**
```
Authorization: Bearer <your_token>
```

## Error Handling
Errors are returned in the following JSON format:
```json
{
  "message": "Error description here",
  "stack": "Stack trace (only in development mode)"
}
```

---

## 1. Authentication Endpoints

### Login User
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "secretpassword"
  }
  ```
- **Success Response (200)**:
  ```json
  {
    "_id": "643...id",
    "name": "User Name",
    "email": "user@example.com",
    "isAdmin": false,
    "token": "eyJhbGciOiJIUzI1..."
  }
  ```

### Register User
- **URL**: `/api/auth`
- **Method**: `POST`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "name": "New User",
    "email": "new@example.com",
    "password": "secretpassword"
  }
  ```
- **Success Response (201)**: Same as login response.

### Get User Profile
- **URL**: `/api/auth/profile`
- **Method**: `GET`
- **Access**: Private (Requires Token)
- **Success Response (200)**:
  ```json
  {
    "_id": "643...id",
    "name": "User Name",
    "email": "user@example.com",
    "isAdmin": false
  }
  ```

---

## 2. Product Endpoints

### Get All Products
- **URL**: `/api/products`
- **Method**: `GET`
- **Access**: Public
- **Success Response (200)**: Array of product objects.
  ```json
  [
    {
      "_id": "643...id",
      "name": "iPhone 11 Pro 256GB Memory",
      "image": "/images/phone.jpg",
      "brand": "Apple",
      "category": "Electronics",
      "description": "Phone description...",
      "price": 599.99,
      "countInStock": 7,
      "rating": 4.5,
      "numReviews": 12
    },
    ...
  ]
  ```

### Get Single Product
- **URL**: `/api/products/:id`
- **Method**: `GET`
- **Access**: Public
- **Success Response (200)**: Single product object.

### Create Product (Admin)
- **URL**: `/api/products`
- **Method**: `POST`
- **Access**: Private/Admin
- **Body**: None (Creates sample product)
- **Response**: Created sample product object.

### Update Product (Admin)
- **URL**: `/api/products/:id`
- **Method**: `PUT`
- **Access**: Private/Admin
- **Request Body**:
  ```json
  {
    "name": "New Name",
    "price": 100,
    "image": "/images/new.jpg",
    "brand": "New Brand",
    "category": "New Category",
    "countInStock": 10,
    "description": "New Description"
  }
  ```

---

## 3. Order Endpoints

### Create New Order
- **URL**: `/api/orders`
- **Method**: `POST`
- **Access**: Private
- **Request Body**:
  ```json
  {
    "orderItems": [
      {
        "name": "Product Name",
        "qty": 1,
        "image": "/images/product.jpg",
        "price": 100.00,
        "product": "product_id_here"
      }
    ],
    "shippingAddress": {
      "address": "123 Main St",
      "city": "Tashkent",
      "postalCode": "100000",
      "country": "Uzbekistan"
    },
    "paymentMethod": "PayPal",
    "itemsPrice": 100.00,
    "taxPrice": 15.00,
    "shippingPrice": 10.00,
    "totalPrice": 125.00
  }
  ```
- **Success Response (201)**: Created order object.

### Get Order Details
- **URL**: `/api/orders/:id`
- **Method**: `GET`
- **Access**: Private
- **Success Response (200)**: Order object populated with user name/email.

---

## 4. Uploads

### Upload Image
- **URL**: `/api/upload`
- **Method**: `POST`
- **Access**: Public
- **Headers**: `Content-Type: multipart/form-data`
- **Body**: FormData with key `image` containing the file.
- **Success Response (200)**: String path to uploaded image.
  ```text
  /uploads/image-123456789.jpg
  ```
