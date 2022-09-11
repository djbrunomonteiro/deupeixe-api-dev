import {Request, Response} from 'express';
import UserSchema from '../schemas/schUser'

class UserController {
    public async getOne (req: Request, res: Response){
        const {id} = req.params;
        const user = await UserSchema.findOne({_id: id});        
        return res.status(200).json({results: user, message: 'Sucesso ao obter usuario'});
    }
}

export default new UserController();