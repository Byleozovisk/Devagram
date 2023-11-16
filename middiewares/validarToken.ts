import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import type { responstasPadraoMsg } from '../types/responstasPadraoMsg'
import jwt, { JwtPayload } from "jsonwebtoken";


export const validarTokenJWT = (handler: NextApiHandler) =>
    (req: NextApiRequest, res: NextApiResponse<responstasPadraoMsg>) => {

        try {
            const { MINHA_CHAVE_JWT } = process.env;
            if (!MINHA_CHAVE_JWT) {
                return res.status(500).json({ erro: 'chave JWT não informada' });
            }

            if (!req || !req.headers) {
                return res.status(401).json({ erro: 'Chave de acesso nã validada' });
            }

            if (req.method !== 'OPTIONS') {
                const autorization = req.headers['authorization'];
                if (!autorization) {
                    return res.status(401).json({ erro: 'Chave de acesso nã validada' });
                }

                const token = autorization.substring(7);
                if (!token) {
                    return res.status(401).json({ erro: 'Chave de acesso nã validada' });
                }

                const decoded = jwt.verify(token, MINHA_CHAVE_JWT) as JwtPayload;
                if (!decoded) {
                    return res.status(401).json({ erro: 'Chave de acesso nã validada' });
                }

                if (!req.query) {
                    req.query = {};
                }

                req.query.userId = decoded._id;
            }
        } catch (e) {
            return res.status(401).json({ erro: 'Chave de acesso nã validada' });
        }


        return handler(req, res);


    }