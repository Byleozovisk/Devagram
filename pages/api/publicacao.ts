import type {NextApiResponse} from 'next';
import type {responstasPadraoMsg} from '../../types/responstasPadraoMsg';
import nc from 'next-connect';
import {upload, uploadImagemCosmic} from '../../services/uploadImagemCosmic';
import {conectarMongoDB} from '../../middiewares/conectaDb';
import {validarTokenJWT} from '../../middiewares/validarToken';
import {publicacaoModel} from '../../models/publicacaoModels';
import {usuarioModel} from '../../models/usuarioModels';


const handler = nc()
    .use(upload.single('file'))
    .post(async (req : any, res : NextApiResponse<responstasPadraoMsg>) => {
        try{
            const {userId} = req.query;
            const usuario = await usuarioModel.findById(userId);
            if(!usuario){
                return res.status(400).json({erro : 'Usuario nao encontrado'});
            }

            if(!req || !req.body){
                return res.status(400).json({erro : 'Parametros de entrada nao informados'});
            }
            const {descricao} = req?.body;

            if(!descricao || descricao.length < 2){
                return res.status(400).json({erro : 'Descricao nao e valida'});
            }
    
            if(!req.file || !req.file.originalname){
                return res.status(400).json({erro : 'Imagem e obrigatoria'});
            }

            const image = await uploadImagemCosmic(req);
            const publicacao = {
                idUsuario : usuario._id,
                descricao,
                foto : image.media.url,
                data : new Date()
            }

            await publicacaoModel.create(publicacao);
            return res.status(200).json({msg : 'Publicacao criada com sucesso'});
        }catch(e){
            console.log(e);
            return res.status(400).json({erro : 'Erro ao cadastrar publicacao'});
        }
});

export const config = {
    api : {
        bodyParser : false
    }
}

export default validarTokenJWT(conectarMongoDB(handler)); 