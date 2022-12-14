import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

export const guard = async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    console.log(`reqq`, req.path);
    if(req.path === '/login' || req.path === '/logingoogle'){
        next()
    }else{
        if(!header){
            return res.status(401).json({message: 'Token not found.'});
        }else{
            const token = header?.split(' ')[1];
            try {
                if(token && process.env.APP_SECRET){
                    await jwt.verify(token, process.env.APP_SECRET);
                    next()
                }
            } catch (error) {
                console.log('err');
                
                return res.status(401).json({msg: error})
            }
          
    
        }

    }


}