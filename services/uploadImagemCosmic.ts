import multer from "multer";
import { createBucketClient } from "@cosmicjs/sdk";

const {BUCKET_SLUG,READ_KEY, WRITE_KEY} = process.env;

const bucketDevagram = createBucketClient({
    bucketSlug: BUCKET_SLUG as string,
    readKey: READ_KEY as string,
    writeKey: WRITE_KEY as string,

});

const storage = multer.memoryStorage();

const upload = multer({storage: storage});

const uploadImagemCosmic = async (req: any) => {
    if (req?.file?.originalname){
        if(
            !req.file.originalname.includes(".png") &&
            !req.file.originalname.includes(".jpg") &&
            !req.file.originalname.includes(".jpng") 
        ){
            throw new Error("Extenção da imagem inválida");
        }
        const media_object = {
            originalname: req.file.originalname,
            buffer: req.file.buffer,
        };

        if (req.ur && req.url.includes("publicacao")){
            return await bucketDevagram.media.insertOne({
                media: media_object,
                folder: "publicacao",
            })
        }else if (req.ur && req.url.includes("usuario")){
            return await bucketDevagram.media.insertOne({
                media: media_object,
                folder: "avatar",
            })
    } else {return await bucketDevagram.media.insertOne({
        media: media_object,
        folder: "stories",
        })
    }
    }
};
export {upload, uploadImagemCosmic};
























































/*const {
    CHAVE_GRAVACAO_AVATARES,
    CHAVE_GRAVACAO_PUBLICACOES,
    BUCKET_AVATARES,
    BUCKET_PUBLICACOES} = process.env;

const Cosmic = cosmicjs();
const bucketAvatares = Cosmic.bucket({
    slug: BUCKET_AVATARES,
    write_key: CHAVE_GRAVACAO_AVATARES
});

const bucketPublicacoes = Cosmic.bucket({
    slug: BUCKET_PUBLICACOES,
    write_key: CHAVE_GRAVACAO_PUBLICACOES
});

const storage = multer.memoryStorage();
const updload = multer({storage : storage});

const uploadImagemCosmic = async(req : any) => {
    if(req?.file?.originalname){

        if(!req.file.originalname.includes('.png') &&
            !req.file.originalname.includes('.jpg') && 
            !req.file.originalname.includes('.jpeg')){
                throw new Error('Extensao da imagem invalida');
        } 

        const media_object = {
            originalname: req.file.originalname,
            buffer : req.file.buffer
        };

        if(req.url && req.url.includes('publicacao')){
            return await bucketPublicacoes.addMedia({media : media_object});
        }else{
            return await bucketAvatares.addMedia({media : media_object});
        }
    }
}

export {updload, uploadImagemCosmic};*/