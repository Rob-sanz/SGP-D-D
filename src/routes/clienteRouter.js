import express from 'express';
import * as clienteController from '../controllers/cliente.js';
const router = express.Router(); // Router es un objeto que nos permite definir rutas

router.get('/', clienteController.getAllClientes); // Definimos la ruta para obtener todos los clientes)

export default router; // Exportamos el router para poder usarlo en otros archivos