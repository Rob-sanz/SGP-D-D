import express, {json} from 'express';
import clienteRouter from './routes/clienteRouter.js';
import authRouter from './routes/authRuter.js';

const app = express();
app.use(json());

app.get('/', (req,res) => {
    res.send("Sistema de Gestion de Pedidos");
})

//ENDPOINTS
app.use('/api/clientes', clienteRouter)
app.use('/api/auth', authRouter)

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto: http://localhost:${port}`);
})