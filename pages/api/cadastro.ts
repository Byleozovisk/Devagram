import type { NextApiRequest, NextApiResponse } from 'next';
import type { responstasPadraoMsg } from '../../types/responstasPadraoMsg';
import type { usuarioRequsicao } from '../../types/usuarioRequisicao';
import { usuarioModel } from '../../models/usuarioModels';
import { conectarMongoDB } from '../../middiewares/conectaDb';
import md5 from 'md5';
import {upload, uploadImagemCosmic} from '../../services/uploadImagemCosmic';
import nc from 'next-connect';
import {politicaCORS} from '../../middiewares/publicarCORS';

const handler = nc()
    .use(upload.single('file'))
    .post(async (req: NextApiRequest, res: NextApiResponse<responstasPadraoMsg>) => {
        const usuario = req.body as usuarioRequsicao;

        // Validar dados do usuário e lidar com erros
        const usuariosComMesmoEmail = await usuarioModel.find({ email: usuario.email });
        if (usuariosComMesmoEmail && usuariosComMesmoEmail.length > 0) {
            return res.status(400).json({ erro: 'E-mail já cadastrado' });
        }

        //enviar imagem para o cosmic
        const image = await uploadImagemCosmic(req);

        //Salvar no banco de dados
        const usuarioAserSalvo = {
            nome: usuario.nome,
            email: usuario.email,
            senha: md5(usuario.senha),
            avatar: image?.media?.url
        };

        await usuarioModel.create(usuarioAserSalvo);

        return res.status(200).json({ msg: 'Usuario cadastrado' });
    });

    export const config = {
        api: {
            bodyParser : false
        }
    }    

export default politicaCORS (conectarMongoDB(handler));