import { Request, Response } from "express";
import UserSchema from "../schemas/schUser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

class AuthController {
  constructor() { }

  public async register(req: Request, res: Response) {
    const { name, email, password, googleToken } = req.body;

    switch (googleToken) {
      case null || undefined:
        if (!name || !email || !password) {
          return res
            .status(422)
            .json({ message: "name/email/password obrigatorios" });
        }

        if (await AuthController.checkIsUser(email)) {
          return res.status(401).json({ message: "usúario já cadastrado." });
        } else {
          const passwordHash = await bcrypt.hash(password, 8);
          const user = await UserSchema.create({
            ...req.body,
            password: passwordHash,
            addres: null,
            fromGoogle: false,
          });
          const payload = AuthController.generateToken(user);
          return res
            .status(200)
            .json({
              results: user,
              token: payload,
              message: "usúario criado com sucesso.",
            });
        }
      default:
        if (await AuthController.checkIsUser(email)) {
          const user = await UserSchema.findOne({ email });
          const payload = AuthController.generateToken(user);
          return res
            .status(200)
            .json({
              results: user,
              token: payload,
              message: "login com sucesso.",
            });
        } else {
          const user = await UserSchema.create({
            ...req.body,
            password: "",
            addres: null,
            fromGoogle: true,
          });
          const payload = AuthController.generateToken(user);
          return res
            .status(200)
            .json({
              results: user,
              token: payload,
              message: "usúario criado com sucesso.",
            });
        }
    }
  }

  public async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({ message: "email/password obrigatorios" });
    }
    const user = await UserSchema.findOne({ email });
    switch (user) {
      case null:
        return res.status(404).json({ message: "email/password obrigatorios" });
      default:
        const compare = await bcrypt.compare(password, user.password);
        if (compare) {
          const payload = AuthController.generateToken(user);
          return res
            .status(200)
            .json({
              results: user,
              token: payload,
              message: "Login com sucesso",
            });
        } else {
          return res
            .status(401)
            .json({ results: null, message: "Email ou Senha Invalido" });
        }
    }
  }

  public async loginGoogle(req: Request, res: Response) {
    const { email, googleToken } = req.body;
    switch (googleToken) {
      case null || undefined:
        return res.status(401).json({ message: "Não autorizado." });
      default:
        const user = await UserSchema.findOne({ email });
        if (user) {
          const payload = AuthController.generateToken(user);
          return res
            .status(200)
            .json({
              results: user,
              token: payload,
              message: "Login com sucesso",
            });
        } else {
          const user = await UserSchema.create({
            ...req.body,
            password: "",
            addres: null,
            fromGoogle: true,
          });
          const payload = AuthController.generateToken(user);
          return res
            .status(200)
            .json({
              results: user,
              token: payload,
              message: "usúario criado com sucesso.",
            });
        }
    }
  }

  public static async checkIsUser(email: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      const user = await UserSchema.findOne({ email });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  public static generateToken(user: any): object | undefined {
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
    };
    if (process.env.APP_SECRET) {
      const token = jwt.sign(payload, process.env.APP_SECRET, {
        expiresIn: "3d",
      });
      return { ...payload, token };
    } else {
      return undefined;
    }
  }

  public async validationToken(req: Request, res: Response) {
    const { token } = req.body;

    if (process.env.APP_SECRET) {
      jwt.verify(token, process.env.APP_SECRET, function(err: any, decoded: any){

        if(err){
          res.status(200).json({error: true, message: 'Token invalido'})
        }else{
          if(decoded){
            console.log(decoded);
            
            if (Date.now() >= decoded?.exp * 1000) {
              res.status(200).json({error: true, message: 'Token expirado'})
            }else{
              res.status(200).json({error: false, message: 'Token validado'});
            }
          }else{
            res.status(200).json({error: true, message: 'Token invalido'});
          }
          
        }
      });

      
    } else {
      return res.status(401).json({error: false, data: null})
    }


  }

}

export default new AuthController();
