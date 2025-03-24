import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req,res) => {
    res.json({success: true, message: 'Hola desde Express! :)'});
})


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto: http://localhost:${port}`);
})