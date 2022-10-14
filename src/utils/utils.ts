
import jwt from "jsonwebtoken";

class Utils {
    
    public async validationToken(token: string) {
        let payload =  {
            id: '',
            name: '',
            email: '',
            iat: null,
            exp: null
        }
    
        if (process.env.APP_SECRET && token) {
            return jwt.verify(token, process.env.APP_SECRET, function (err: any, decoded: any) {
                
    
                if (err) {
                    return { error: true, payload, message: 'Token invalido' };
                } else {
                    if (decoded) {
                        payload = {
                            id: decoded?.id,
                            name: decoded?.name,
                            email:  decoded?.email,
                            iat:  decoded?.iat,
                            exp: decoded?.exp,
                        }
                        console.log('decoded', decoded);
    
                        if (Date.now() >= decoded?.exp * 1000) {
                            return { error: true, message: 'Token expirado' };
                        } else {
                            return { error: false, payload, message: 'Token validado' };
                        }
                    } else {
                        return { error: true, payload, message: 'Token invalido' };
                    }
    
                }
            });
        }else{

            return { error: true, payload, message: 'Sem Token' };
        }
    
    }
}

export default new Utils();