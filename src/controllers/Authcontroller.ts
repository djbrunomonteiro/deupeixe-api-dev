import {Request, Response} from 'express';
import UserSchema from '../schemas/schUser'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import dotenv from "dotenv";
import { userInfo } from 'os';

dotenv.config();

class AuthController {

    constructor(){}

    public async register (req: Request, res: Response){
        const { name, email, password} = req.body;

        if(!name || !email || !password){ return res.status(422).json({message: 'name/eemail/password obrigatorios'})}
        
        if(await AuthController.checkIsUser(email)){
            return res.status(401).json({message: 'usúario já cadastrado.'})
        }else{
            const passwordHash = await bcrypt.hash(password, 8);
            const user = await UserSchema.create({...req.body, password: passwordHash, plan: 'free', addres: null});
            return res.status(200).json({results: {...user, id: user._id}, message: 'usúario criado com sucesso.'})
        }
        
    }

    public async login (req: Request, res: Response){
        const { email, password} = req.body;
        if(!email || !password){ return res.status(422).json({message: 'eemail/password obrigatorios'})}
        const user = await UserSchema.findOne({email});
        console.log(user);

        switch (user){
            case null:
                return res.status(404).json({message: 'Usuario nao encontrado'});
            default:
                const compare = await bcrypt.compare(password, user.password)
                if(compare){
                    const payload = {
                       _id: user.id,
                       name: user.name,
                       email: user. email
                    };

                    console.log('app secret', process.env.APP_SECRET);
                    if(process.env.APP_SECRET){
                        const token = jwt.sign(payload, process.env.APP_SECRET, {expiresIn: '3d'});
                        return res.status(200).json({results: {...payload, token}, message: 'Login com sucesso'})
                    }else{
                        res.status(500).json({results: null, message: 'Ocorreu um error, tente novamente.'})
                    }
                    

                }else{
                    return res.status(401).json({results: null, message: 'Eemail ou Senha Invalido'})
                }

        }

    }

    public async loginGoogle (req: Request, res: Response){
        const { email, googleToken, password} = req.body;
        
        if(!email || !googleToken){ return res.status(422).json({message: 'email obrigatorio'})}
        let user = await UserSchema.findOne({email});
        let payload = {
            id:'',
            name: '',
            email: '',
         };

        switch (user){
            case null:
                const passwordHash = await bcrypt.hash(password, 8);
                await UserSchema.create({...req.body, password: passwordHash, plan: 'free', addres: null});
                user = await UserSchema.findOne({email});
                if(user && process.env.APP_SECRET){
                    payload = {
                        id: user._id,
                        name: user.name,
                        email: user.email
                     };
                     const token = jwt.sign(payload, process.env.APP_SECRET, {expiresIn: '3d'});
                     return res.status(200).json({results: {...payload, token}, message: 'Login com sucesso'})
                }else{
                    return res.status(500).json({results: null, message: 'Ocorreu um error, tente novamente.'})
                }
            default:
                payload = {
                   id: user._id,
                   name: user.name,
                   email: user.email
                };

                if(process.env.APP_SECRET){
                    const token = jwt.sign(payload, process.env.APP_SECRET, {expiresIn: '3d'});
                    return res.status(200).json({results: {...payload, token}, message: 'Login com sucesso'})
                }else{
                    res.status(500).json({results: null, message: 'Ocorreu um error, tente novamente.'})
                }
        }

    }

    public static async checkIsUser(email: string): Promise<boolean>{
        return new Promise(async (resolve)=>{
            const user = await UserSchema.findOne({email}); 
            if(user){resolve(true)}
            else{resolve(false)}
        })
    }


}

export default new AuthController();