import express, {json} from 'express';
import clienteRouter from './routes/clienteRouter.js';
//import clientes from './local_db/clientes.json' with { type: 'json' };

const app = express();
app.use(json());

app.get('/', (req,res) => {
    res.send("Sistema de Gestion de Pedidos");
})

app.use('/api/clientes', clienteRouter)

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto: http://localhost:${port}`);
})