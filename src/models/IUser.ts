import { Document } from "mongoose"
export interface IUser extends Document{
    _id?: string,
    name: string,
    email: string,
    password: string,
    phone?: string,
    photo?: string,
    plan?: string,
    addres?: any,
    createdAt?: string,
    updateAt?: string
}