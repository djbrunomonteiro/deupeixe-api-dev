import { model, Schema } from 'mongoose';
import {IUser} from '../models/IUser'


const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    phone: String,
    photo: String,
    plan: {type: String, required: true},
    addres: Object,
},{ timestamps: true});

export default model<IUser>('User', UserSchema);