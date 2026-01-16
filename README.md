# Agrom E-commerce Backend

Backend API for the Agrom E-commerce platform, built with Node.js, Express, and MongoDB.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)

## Overview

This is the RESTful API server for the Agrom E-commerce application. It handles user authentication, product management, order processing, and image uploads.

## Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: JWT (JSON Web Tokens)
- **Image Handling**: Multer

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- NPM or Yarn
- MongoDB instance (local or Atlas)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up environment variables:
    Create a `.env` file in the root directory and add the following:
    ```env
    NODE_ENV=development
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

### Running the Server

- **Development Mode** (with nodemon):
    ```bash
    npm run dev
    ```

- **Production Mode**:
    ```bash
    npm start
    ```

- **Seed Data**:
    To import sample data:
    ```bash
    npm run data:import
    ```
    To destroy data:
    ```bash
    npm run data:destroy
    ```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user & get token | Public |
| `POST` | `/api/auth` | Register a new user | Public |
| `GET` | `/api/auth/profile` | Get user profile | Private |

### Products

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Fetch all products | Public |
| `GET` | `/api/products/:id` | Fetch single product | Public |
| `POST` | `/api/products` | Create a product | Private/Admin |
| `PUT` | `/api/products/:id` | Update a product | Private/Admin |
| `DELETE` | `/api/products/:id` | Delete a product | Private/Admin |

### Orders

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Create new order | Private |
| `GET` | `/api/orders/:id` | Get order by ID | Private |

### Uploads

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/upload` | Upload an image | Public |

## License

This project is open source.
