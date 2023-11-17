import type {NextApiRequest, NextApiResponse} from 'next';
import { conectarMongoDB } from '../../middiewares/conectaDb';
import { validarTokenJWT } from '../../middiewares/validarToken';
import { publicacaoModel } from '../../models/publicacaoModels';
import { usuarioModel } from '../../models/usuarioModels';
import type {responstasPadraoMsg} from '../../types/responstasPadraoMsg';
import {politicaCORS} from '../../middiewares/publicarCORS';

const comentarioEndpoint = async (req : NextApiRequest, res : NextApiResponse<responstasPadraoMsg>) => {
    try{
        if(req.method === 'PUT'){
            const {userId, id} = req.query;
            const usuarioLogado = await usuarioModel.findById(userId);
            if(!usuarioLogado){
                return res.status(400).json({erro : 'Usuario nao encontrado'});
            }
            
            const publicacao =  await publicacaoModel.findById(id);
            if(!publicacao){
                return res.status(400).json({erro : 'Publicacao nao encontrada'});
            }

            if(!req.body || !req.body.comentario
                || req.body.comentario.length < 2){
                return res.status(400).json({erro : 'Comentario nao e valido'});
            }

            const comentario = {
                usuarioId : usuarioLogado._id,
                nome : usuarioLogado.nome,
                comentario : req.body.comentario
            }

            publicacao.comentarios.push(comentario);
            await publicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao);
            return res.status(200).json({msg : 'Comentario adicionado com sucesso'});
        }
        
        return res.status(405).json({erro : 'Metodo informado nao e valido'});
    }catch(e){
        console.log(e);
        return res.status(500).json({erro : 'Ocorreu erro ao adicionar comentario'});
    }
}

export default politicaCORS (validarTokenJWT(conectarMongoDB(comentarioEndpoint)));