import { model, Schema } from 'mongoose';
import {IUser} from '../models/IUser'


const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: String,
    googleToken: String,
    phone: String,
    photo: String,
    addres: Object,
    fromGoogle: Boolean
},{ timestamps: true});

export default model<IUser>('User', UserSchema);