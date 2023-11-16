import type { NextApiRequest, NextApiResponse } from "next";
import{conectarMongoDB} from '../../middiewares/conectaDb';
import type {responstasPadraoMsg} from '../../types/responstasPadraoMsg';
import type {loginResposta} from '../../types/loginResposta';
import md5 from 'md5';
import { usuarioModel } from "../../models/usuarioModels";
import jwt from 'jsonwebtoken';



const endpointLogin = async (
    req : NextApiRequest,
    res : NextApiResponse<responstasPadraoMsg | loginResposta>
) => {

const {MINHA_CHAVE_JWT} = process.env;
    if(!MINHA_CHAVE_JWT){
        res.status(500).json({erro: 'ENV jwt não informada'})
    }

if (req.method === 'POST'){
        const {login, senha} = req.body;

        const usuarioEncontrado = await usuarioModel.findOne({email: login, senha: md5(senha)});
        if (usuarioEncontrado){
            const usuarioLogado = usuarioEncontrado[0];

            const token = jwt.sign({_id : usuarioEncontrado._id}, MINHA_CHAVE_JWT);

            return res.status(200).json({nome: usuarioEncontrado.nome,
                                email: usuarioEncontrado.email,
                                token});
            }
        
            return res.status(400).json({erro : 'Usuario ou senha não encontrados'});
    }
    return res.status(405).json({erro : 'Metodo informado não é válido'});
}
            

export default conectarMongoDB(endpointLogin);