import { query } from './src/db.js';

(async () => {
    try {
        const res = await query('SELECT NOW()');
        console.log('Conexión exitosa:', res.rows);
    } catch (err) {
        console.error('Error en la conexión:', err);
    }
})();