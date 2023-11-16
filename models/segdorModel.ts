import mongoose, {Schema} from 'mongoose';

const SeguidorSchema = new Schema({
    // seguidir
    usuarioId : {type : String, required : true},
    // seguindo
    usuarioSeguidoId : {type : String, required : true}
});

export const seguidorModel = (mongoose.models.seguidores ||
    mongoose.model('seguidores', SeguidorSchema));