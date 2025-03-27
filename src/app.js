import express from 'express';

const app = express();
app.use(express.json());

app.get('/', (req,res) => {
    res.send("Sistema de Gestion de Pedidos");
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto: http://localhost:${port}`);
})