import { query } from '../db.js';

//OBTIENE TODOS LOS CLIENTES
export const getAllClientes = async (req,res) => {
    try {
        const result = await query(
            'SELECT * FROM clientes'
        );
        res.status(200).json({
            success: true,
            data: {message: 'cliente actualizado correctamente',
                clientes: result.rows    
            }
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error en la consulta de Clientes');
    }
};

//OBTIENE CLIENTE POR ID
export const getClienteById = async (req,res) => {
    const {id} = req.params;
    try{

        if(isNaN(id)){
           return res.status(400).json({
            success: false,
            data: 'El ID debe ser un numero'
           })
        }

        const result = await query(
            `SELECT * FROM clientes WHERE id_cliente = $1`,
            [id]
        )

        if(result.rows.length === 0){
            return res.status(404).json({
                success: false,
                data: "Cliente no encontrado"
            })
        }
        res.json(result.rows[0]);
    }
    catch (err){
        console.error(err);
        res.status(500).send('Error en la consulta de Cliente por ID');
    }
};

//CREA CLIENTE
export const createCliente = async (req,res) => {
    const {nombre, telefono, correo, direccion} = req.body;  

    try{

        if(nombre === undefined || telefono === undefined){
            return res.status(400).json({
                success: false,
                data: 'Nombre y Telefono son requeridos'
            })
        }

        //VERIFICA SI EL NOMBRE EXISTE EN LA BASE DE DATOS
        const verificarNombre = await query(
            'SELECT * FROM clientes WHERE nombre = $1',
            [nombre]
        )
        if(verificarNombre.rows.length > 0){
            return res.status(400).json({
                success: false,
                data: "Ya existe un cliente con este nombre"
            })
        }

        //VERIFICAR SI EL TELEFONO YA EXISTE EN LA BASE DE DATOS
        const verificarTelefono = await query(
            'SELECT * FROM clientes WHERE telefono = $1',
            [telefono]
        )
        if(verificarTelefono.rows.length > 0){
            return res.status(400).json({
                success: false,
                data: 'Telefono ya registrado'
            })
        }

        /* Si se desea validar solo telefonos de 8 digitos
        if(telefono.length <8){
            return res.status(400).json({
                success: false,
                data: 'Telefono debe ser de 8 digitos'
            })
        }
        */

        const result = await query(
            `INSERT INTO clientes (nombre, telefono, correo, direccion) VALUES ($1,$2,$3,$4) RETURNING *`,
            [nombre, telefono, correo, direccion]
        )

        const nuevoCliente = result.rows[0];
        res.status(201).json({
            succes: true,
            data: 'Cliente creado correctamente',
            cliente: nuevoCliente
        })
    }
    catch(err){
        console.error(err);
        res.status(500).send('Error en la creacion de Cliente')
    }
};

//ACTUALIZA CLIENTE
export const UpdateCliente = async (req,res) => {
    const {id} = req.params;
    const {nombre, telefono, correo, direccion} =  req.body;
    
    try{
        if(nombre === undefined || telefono === undefined){
            return res.status(400).json({
                success: false,
                data: 'Nombre y Telefono son requeridos para actualizar'
            })
        }

        if(isNaN(id)){
            return res.status(400).json({
             success: false,
             data: 'El ID debe ser un numero'
            })
        }

        //VERIFICA SI EL NOMBRE EXISTE EN LA BASE DE DATOS
        const verificarNombre = await query(
            'SELECT * FROM clientes WHERE nombre = $1',
            [nombre]
        )
        if(verificarNombre.rows.length > 0){
            if(verificarNombre.rows[0].id_cliente !== parseInt(id)){
                return res.status(400).json({
                    success: false,
                    data: "Ya existe un cliente con este nombre"
                })
            }
        }

        //VERIFICAR SI EL TELEFONO YA EXISTE EN LA BASE DE DATOS
        const verificarTelefono = await query(
            'SELECT * FROM clientes WHERE telefono = $1',
            [telefono]
        )
        if(verificarTelefono.rows.length > 0){
            if(verificarTelefono.rows[0].id_cliente !== parseInt(id)){
                return res.status(400).json({
                    success: false,
                    data: "Ya existe cliente con este telefono"
                })
            }
        }

        const result = await query(
            `UPDATE clientes SET nombre = $1, telefono = $2, correo = $3, direccion = $4 WHERE id_cliente = $5`,
            [nombre, telefono, correo, direccion,id]
        )

        if(result.rows.length === 0){
            return res.status(404).json({
                success: false,
                data: "Cliente no encontrado"
            })
        }


        res.status(200).json({
            success: true,
            data: 'cliente actualizado correctamente',
            cliente: {nombre, telefono, correo, direccion}
        })

    }
    catch(err){
        console.error(err);
        res.status(500).send('Error en la actualizacion de Cliente');
    }
};

//ELIMINA CLIENTE
export const deleteCliente = async (req,res) => {
    const {id}  = req.params;

    try{

        if(isNaN(id)){
            return res.status(400).json({
             success: false,
             data: 'El ID debe ser un numero'
            })
        }

        const result = await query(
            "DELETE FROM clientes WHERE id_cliente = $1 RETURNING *",
            [id]
        )

        if(result.rows.length < 1){
            return res.status(400).json({
                success: false,
                data: "Cliente no encontrado"
            })
        }

        res.status(200).json({
            success: true,
            data: "Cliente eliminado",
        })
    }
    catch(err){
        console.error(err);
        res.status(500).json({
            success: false,
            data: "Error en la eliminación de cliente"
        })
    }
};
