import jwt from 'jsonwebtoken'

export const authJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).send("Falta Autorización")
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token,process.env.JWT_SECRET, (err,usuario) => {
        if(err){
            return res.status(401).send("Acceso no autorizado")
        }

        req.usuario = usuario;
        next();
    }) 
}

export const isAdmin = (req,res,next) => {
    const usuario = req.usuario

    if(usuario.rol !== "Administrador"){
        return res.status(401).send("NO tienes acceso a este recurso")
    }
}