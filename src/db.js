import pg from 'pg';
import dotenv from 'dotenv';
//import jwt from 'jsonwebtoken';

dotenv.config(); //Habilitamos poder usar process.env
const connectionString = process.env.DATABASE_URL;

const { Pool } =  pg; 
const pool = new Pool({     
    connectionString,   //Creamos un objeto tipo Pool que recibe el conectioString 
    //ssl: { rejectUnauthorized: false }
});

export const query = (text, params) => pool.query(text, params); //Exportamos una funcion llamada query que recibe un texto y parametros
export { pool };





