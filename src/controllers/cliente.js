import { query } from '../db.js';

export const getAllClientes = async (req,res) => {
    try {
        const result = await query('SELECT id_cliente, nombre, telefono, correo, direccion FROM clientes');
        res.json(result.rows);
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Error en la consulta de Clientes');
    }

}
