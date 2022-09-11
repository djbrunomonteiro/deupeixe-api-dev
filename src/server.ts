import app from './app';
import dotenv from "dotenv";


dotenv.config();

const SERVE_PORT = process.env.SERVE_PORT;
const VERSION = process.env.VERSION;
const NODE_ENV = process.env.NODE_ENV;


app.listen(SERVE_PORT, ()=>{
    console.log(`API ${NODE_ENV} ${VERSION} run port ${SERVE_PORT}`);
    
});