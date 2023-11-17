import type {NextApiRequest, NextApiResponse} from 'next';
import { conectarMongoDB } from '../../middiewares/conectaDb';
import { validarTokenJWT } from '../../middiewares/validarToken';
import { seguidorModel } from '../../models/segdorModel';
import { usuarioModel } from "../../models/usuarioModels";
import type {responstasPadraoMsg} from '../../types/responstasPadraoMsg';
import {politicaCORS} from '../../middiewares/publicarCORS';

const endpointSeguir = 
    async (req : NextApiRequest, res : NextApiResponse<responstasPadraoMsg>) => {
    try{
        if(req.method === 'PUT'){

            const {userId, id} = req?.query;

            // usuario logado/autenticado = quem esta fazendo as acoes
            const usuarioLogado = await usuarioModel.findById(userId);
            if(!usuarioLogado){
                return res.status(400).json({erro : 'Usuario logado nao encontrado'});
            }

            // id do usuario e ser seguidor - query
            const usuarioASerSeguido = await usuarioModel.findById(id);
            if(!usuarioASerSeguido){
                return res.status(400).json({ erro : 'Usuario a ser seguido nao encontrado'});
            }

            // buscar se EU LOGADO sigo ou nao esse usuario
            const euJaSigoEsseUsuario = await seguidorModel
                .find({usuarioId: usuarioLogado._id, usuarioSeguidoId : usuarioASerSeguido._id});
            if(euJaSigoEsseUsuario && euJaSigoEsseUsuario.length > 0){
                // sinal que eu ja sigo esse usuario
                euJaSigoEsseUsuario.forEach(async(e : any) => 
                    await seguidorModel.findByIdAndDelete({_id : e._id}));
                
                usuarioLogado.seguindo--;
                await usuarioModel.findByIdAndUpdate({_id : usuarioLogado._id}, usuarioLogado);
                usuarioASerSeguido.seguidores--;
                await usuarioModel.findByIdAndUpdate({_id : usuarioASerSeguido._id}, usuarioASerSeguido);

                return res.status(200).json({msg : 'Deixou de seguir o usuario com sucesso'});
            }else{
                // sinal q eu nao sigo esse usuario
                const seguidor = {
                    usuarioId : usuarioLogado._id,
                    usuarioSeguidoId : usuarioASerSeguido._id
                };
                await seguidorModel.create(seguidor);

                // adicionar um seguindo no usuario logado
                usuarioLogado.seguindo++;
                await usuarioModel.findByIdAndUpdate({_id : usuarioLogado._id}, usuarioLogado);

                // adicionar um seguidor no usuario seguido
                usuarioASerSeguido.seguidores++;
                await usuarioModel .findByIdAndUpdate({_id : usuarioASerSeguido._id}, usuarioASerSeguido);

                return res.status(200).json({msg : 'Usuario seguido com sucesso'});
            }
        }
        
        return res.status(405).json({erro : 'Metodo informado nao existe'});
    }catch(e){
        console.log(e);
        return res.status(500).json({erro : 'Nao foi possivel seguir/deseguir o usuario informado'});
    }
}

export default politicaCORS (validarTokenJWT(conectarMongoDB(endpointSeguir)));