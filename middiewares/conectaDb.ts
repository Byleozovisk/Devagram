import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import mongoose from 'mongoose';
import type {responstasPadraoMsg} from '../types/responstasPadraoMsg';

export const conectarMongoDB = (handler : NextApiHandler) =>
    async (req : NextApiRequest, res : NextApiResponse<responstasPadraoMsg>) => {

        // Verificar de o Banco já está conectado, se estiver seguir para o endpoint
        if (mongoose.connections[0].readyState){
            return handler(req, res);
        }
   

        // conectar ao env
        const {DB_CONEXAO_STRING} = process.env;

        // Caso a env esteja vazia aborte e avise o programador

        if(!DB_CONEXAO_STRING){
            return res.status(500).json({erro: 'ENV de configuração não informado'});
        } 

      
        mongoose.connection.on('conected', () => console.log('Banco de dados conectado'));
        mongoose.connection.on('error', error => console.log(`Ocorreu um erro ao conectar no banco: ${error}`));
        await mongoose.connect(DB_CONEXAO_STRING);

        // Agora seguir para o endpoint pois já estamos conectados.
        return handler(req, res);
    }