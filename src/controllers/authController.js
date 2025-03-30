import {query} from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const inisioSesion = async (req,res) => {
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
        res.status(400).json({
            success: false,
            data: "Fallo Inicio de Sesion "
        })
    }
}