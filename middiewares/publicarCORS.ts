import type {NextApiRequest, NextApiResponse, NextApiHandler} from 'next';
import type {responstasPadraoMsg} from '../types/responstasPadraoMsg';
import NextCors from 'nextjs-cors';

export const politicaCORS = (handler : NextApiHandler) =>
    async (req : NextApiRequest, res : NextApiResponse<responstasPadraoMsg>) => {
    try{
        await NextCors(req, res, {
            origin : '*',
            methods : ['GET', 'POST', 'PUT'],
            optionsSuccessStatus : 200,
        });

        return handler(req, res);
    }catch(e){
        console.log('Erro ao tratar a politica de CORS:', e);
        return res.status(500).json({erro : 'Ocorreu erro ao tratar a politica de CORS'});
    }
}