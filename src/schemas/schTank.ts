import { model, Schema } from 'mongoose';
import { ITank } from '../models/ITank';

const TankSchema = new Schema({
    species: String,
    area: String,
    date_start: String,
    fish_start: String,
    cycle: String,
    weigth_start: String,
    food_cycle: String,
    date_end: String,
    fish_end: String,
    wigth_end: String,
    food: Object,
    revenue: Array,
    expenses: Object,
    id_user: String,
    id_collaborator: String

},{ timestamps: true});

export default model<ITank>('Tank', TankSchema);