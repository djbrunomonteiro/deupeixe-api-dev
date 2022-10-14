import { Request, Response } from 'express';
import TankSchema from '../schemas/schTank'

import Utils from '../utils/utils'

class TankController {
    public async getOne(req: Request, res: Response) {
        const { id } = req.params;
        const tank = await TankSchema.findOne({ _id: id });
        return res.status(200).json({ results: tank, message: 'Sucesso ao obter Tank' });
    }

    public async getAll(req: Request, res: Response) {
        const { authorization } = req.headers;
        const token = authorization?.split(' ')[1]

        const validation = await Utils.validationToken(token? token : '');

        if(validation?.error){
            return res.status(200).json({error: true, status: 401, message: validation?.message})
        }else{
            if(validation?.payload){
                const results = await TankSchema.find({id_user: validation?.payload?.id});
                console.log(results);
                
                return res.status(200).json({error: false, status: 200, results, message: validation?.message})
            }

        }

    }

    public async createOne(req: Request, res: Response) {
        delete req.body?._id;

        const { authorization } = req.headers;
        const token = authorization?.split(' ')[1];

        const validation = await Utils.validationToken(token? token : '');

        if(validation?.error){
            return res.status(200).json({error: true, status: 401, message: validation?.message})
        }else{
            if(validation?.payload){
                const tank = await TankSchema.create({...req.body, id_user: validation?.payload?.id});
                if(tank.errors){
                    return res.status(200).json({
                        status: 500,
                        error: true,
                        results: undefined,
                        message: "Ocorreu um error, tente novamente.",
                    });
        
                }else{
                    return res.status(200).json({
                        status: 200,
                        error: false,
                        results: tank,
                        message: "Item criado com sucesso.",
                    });
                }
                
            }

        }
    }


}

export default new TankController();