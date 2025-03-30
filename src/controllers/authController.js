import {query} from '../db.js';
import bcrypt, { hashSync } from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const incribirse = async (req,res) => {
    const {nombre, correo, contrasena, rol, nombre_usuario} = req.body

    try{

        if(!nombre || !nombre_usuario || !contrasena || !rol ){
            return res.status(400).json({
                success: false,
                data: "nombre, nombre_usuario, contrasena con campos requeridos"
            })
        }

        if(typeof nombre_usuario !== 'string' || typeof contrasena !== 'string' || typeof rol !== 'string'){
            return res.status(400).send("Credenciales deben ser enviadas como cadenas de texto")
        }

        if(nombre_usuario.length < 3 || nombre_usuario.length > 10){
            return res.status(400).send("Nombre de usuario debe contener entre 3 a 10 caracteres")
        }

        if(contrasena.length < 6 ){
            return res.status(400).send("Contraseña muy corta")
        }

        if(rol !== "Recepcion" && rol !== "Produccion" && rol !== "Administrador"){
            return res.status(400).send("Rol no valido (Recepcion, Produccion, Administrador)")  
        }
    
        const usuarios = await query(
            'SELECT * FROM usuarios WHERE nombre_usuario = $1',
            [nombre_usuario]
        )

        if(usuarios.rows.length > 0 ){
            return res.status(400).send("Usuario ya Existe")
        } 
        
        const hashPassword = await bcrypt.hash(contrasena,10);

        const result = await query (
            'INSERT INTO usuarios(nombre, correo, contrasena, rol, nombre_usuario) VALUES ($1,$2,$3,$4,$5) RETURNING *',
            [nombre, correo, hashPassword, rol, nombre_usuario]
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
    const {nombre_usuario, contrasena} = req.body
    try{

        if(!nombre_usuario || !contrasena){
            return res.status(400).json({
                success: false,
                data: "Usuario y Contraseña con requeridos"
            })
        }

        const result = await query(
            'SELECT * FROM usuarios WHERE nombre_usuario = $1',
            [nombre_usuario]
        )
        const usuarios = result.rows;

        if(usuarios.length === 0){
            return res.status(404).json({
                success: false,
                data: "Credenciales Incorrectas *usuario"
            })
        }

        const usuario = usuarios[0];

        const isPasswordValid = await bcrypt.compare( contrasena, usuario.contrasena )

        if(!isPasswordValid){
            return res.status(400).json({
                success: false,
                data: "Credenciales Incorrectas *contraseña"
            })
        }

        const tocken = jwt.sign(
            {
                nombre_usuario: usuario.nombre_usuario,
                id_usuario: usuario.id_usuario,
                rol : usuarios.rol
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWK_EXPIRE
            }
        )

        res.status(200).json({
            success : true,
            data: {
                message: "Inicio Sesion Exitoso",
                id_usuario: usuario.id_usuario,
                tocken: tocken,
            } 
        })

    }catch(err){
        console.error(err),
        res.status(500).json({
            success: false,
            data: "Fallo Inicio de Sesion "
        })
    }
}