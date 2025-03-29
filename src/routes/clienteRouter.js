import express from 'express';
import * as clienteController from '../controllers/cliente.js';
const router = express.Router(); // Router es un objeto que nos permite definir rutas

router.get('/', clienteController.getAllClientes); 
router.get('/:id', clienteController.getClienteById);
router.post('/', clienteController.createCliente); 
router.patch('/:id', clienteController.UpdateCliente);
router.delete('/:id',clienteController.deleteCliente)

export default router; // Exportamos el router para poder usarlo en otros archivos