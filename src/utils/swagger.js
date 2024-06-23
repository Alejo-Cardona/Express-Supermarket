import express from "express";
import __dirname from "../utils/utils.js"
import swaggerJsdoc from "swagger-jsdoc";
import app from "../app.js"

// Swagger API Documentation
const swaggerOptions = {
    definition: {
        openapi:'3.0.1',
        info: {
            title: 'Express-Supermarket',
            description: 'Hola, esta API REST simula la aplicación web de un supermercado. Proporciona todas las funcionalidades necesarias para llevar a cabo el proceso de selección y compra de productos de supermercado, utilizando una base de datos NoSQL (MongoDB) de manera eficiente.',
            version: '1.0.0',
        },
    },
    apis:  [
        "./src/docs/Carts.yaml",
        "./src/docs/Products.yaml",
        "./src/docs/Users.yaml"
    ],
};

const specs = swaggerJsdoc(swaggerOptions);

export default specs

