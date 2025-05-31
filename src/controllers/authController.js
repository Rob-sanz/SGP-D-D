import {query} from '../db.js';
import bcrypt, { hashSync } from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const incribirse = async (req,res) => {
    const {nombre, telefono, contrasenia, nombre_usuario, area} = req.body

    try{

        if(!nombre || !nombre_usuario || !contrasenia || !area || !telefono ){
            return res.status(400).json({
                success: false,
                data: "Todos los campos son requeridos [nombre, telefono, contrasenia, nombre_usuario, area]"
            })
        }

        if(typeof nombre_usuario !== 'string' || typeof contrasenia !== 'string' || typeof area !== 'string'){
            return res.status(400).send("Credenciales deben ser enviadas como cadenas de texto")
        }

        if(nombre_usuario.length < 3 || nombre_usuario.length > 10){
            return res.status(400).send("Nombre de usuario debe contener entre 3 a 10 caracteres")
        }

        if(contrasenia.length < 6 ){
            return res.status(400).send("Contraseña muy corta")
        }

        if(area <1 || area >3){
            return res.status(400).send("Rol no valido (1.Produccion, 2.Recepcion)")  
        }
    
        const usuarios = await query(
            'SELECT * FROM usuarios WHERE usuario = $1',
            [nombre_usuario]
        )

        if(usuarios.rows.length > 0 ){
            return res.status(400).send("Usuario ya Existe")
        } 
        
        const hashPassword = await bcrypt.hash(contrasenia,10);

        const result = await query (
            'SELECT * FROM sp_insertar_usuario($1, $2, $3, $4, $5)',
            [nombre, telefono, nombre_usuario, hashPassword, area]
        )

        const usuario = result.rows[0]

        res.status(200).json({
            success: true,
            data: {
                message: "Usuario registrado",
                usuarios: usuario
            }
        })
    }
    catch(err){
        console.error(err)
        res.status(500).send("Error al incribirse")
    }
}



export const inicioSesion = async (req,res) => {
    const {nombre_usuario, contrasenia} = req.body
    try{

        if(!nombre_usuario || !contrasenia){
            return res.status(400).json({
                success: false,
                data: "Usuario y Contraseña con requeridos"
            })
        }

        const result = await query(
            'SELECT * FROM usuarios WHERE usuario = $1',
            [nombre_usuario]
        )
        const usuarios = result.rows;

        if(usuarios.length == 0){
            return res.status(404).json({
                success: false,
                data: "Credenciales Incorrectas *usuario"
            })
        }

        const usuario = usuarios[0];

        const isPasswordValid = await bcrypt.compare( contrasenia, usuario.contrasenia )

        if(!isPasswordValid){
            return res.status(400).json({
                success: false,
                data: "Credenciales Incorrectas *contraseña"
            })
        }

        const token = jwt.sign(
            {
                nombre_usuario: usuario.nombre_usuario,
                id_usuario: usuario.id_usuario,
                area : usuario.area
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_REFRESH_EXPIRES
            }
        )

        res.status(200).json({
            success : true,
            data: {
                message: "Inicio Sesion Exitoso",
                id_usuario: usuario.id_usuario,
                token: token,
            } 
        })

    }catch(err){
        console.error(err),
        res.status(500).json({
            success: false,
            data: "Fallo Inicio de Sesion"
        })
    }
}