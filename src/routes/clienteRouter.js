import express from 'express';
import * as clienteController from '../controllers/cliente.js';
import { authJWT, isAdmin} from '../middleware/auth.js';
const router = express.Router(); // Router es un objeto que nos permite definir rutas

router.get('/',clienteController.getAllClientes); 
router.get('/:id', [authJWT],clienteController.getClienteById);
router.post('/', [authJWT],clienteController.createCliente); 
router.patch('/:id', [authJWT],clienteController.UpdateCliente);
router.delete('/:id', [authJWT, isAdmin],clienteController.deleteCliente)

export default router; // Exportamos el router para poder usarlo en otros archivos