import type {NextApiRequest, NextApiResponse} from 'next';
import type {responstasPadraoMsg} from '../../types/responstasPadraoMsg';
import {conectarMongoDB} from '../../middiewares/conectaDb';
import {validarTokenJWT} from '../../middiewares/validarToken';
import {usuarioModel} from '../../models/usuarioModels';
import {publicacaoModel} from '../../models/publicacaoModels';
import {seguidorModel} from '../../models/segdorModel';
import {politicaCORS} from '../../middiewares/publicarCORS';

const feedEndpoint = async (req : NextApiRequest, res : NextApiResponse<responstasPadraoMsg | any>) => {
    try{
        if(req.method === 'GET'){
            if(req?.query?.id){
                // agora q tenho o id do usuario
                // como eu valido se o usuario valido
                const usuario = await usuarioModel.findById(req?.query?.id);
                if(!usuario){
                    return res.status(400).json({erro : 'Usuario nao encontrado'});
                }

                // e como eu busco as publicacoes dele?
                const publicacoes = await publicacaoModel
                    .find({idUsuario : usuario._id})
                    .sort({data : -1});

                return res.status(200).json(publicacoes);
            }else{
                const {userId} = req.query;
                const usuarioLogado = await usuarioModel.findById(userId);
                if(!usuarioLogado){
                    return res.status(400).json({erro : 'Usuario nao encontrado'});
                }

                const seguidores = await seguidorModel.find({usuarioId : usuarioLogado._id});
                const seguidoresIds = seguidores.map(s => s.usuarioSeguidoId);

                const publicacoes = await publicacaoModel.find({
                    $or : [
                        {idUsuario : usuarioLogado._id},
                        {idUsuario : seguidoresIds}
                    ]
                })
                .sort({data : -1});

                const result = [];
                for (const publicacao of publicacoes) {
                   const usuarioDaPublicacao = await usuarioModel.findById(publicacao.idUsuario);
                   if(usuarioDaPublicacao){
                        const final = {...publicacao._doc, usuario : {
                            nome : usuarioDaPublicacao.nome,
                            avatar : usuarioDaPublicacao.avatar
                        }};
                        result.push(final);  
                   }
                }

                return res.status(200).json(result);
            }
        }
        return res.status(405).json({erro : 'Metodo informado nao e valido'});
    }catch(e){
        console.log(e);
    }
    return res.status(400).json({erro : 'Nao foi possivel obter o feed'});
}

export default politicaCORS (validarTokenJWT(conectarMongoDB(feedEndpoint)));