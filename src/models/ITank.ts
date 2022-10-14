import { Document } from "mongoose"
export interface ITank extends Document{
    _id?: string,
    species: string,
    area: string,
    date_start: string,
    fish_start?: string,
    cycle?: string,
    weigth_start?: string,
    food_cycle?: any,
    date_end?: string,
    fish_end?: string
    wigth_end?: string
    food?: any,
    revenue?: any
    expenses?: any,
    id_user?: string,
    id_collaborator?: string
}