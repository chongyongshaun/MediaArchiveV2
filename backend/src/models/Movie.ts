import mongoose, {Schema, Document} from "mongoose";

interface IMovie extends Document {
    title: string;
    userRating: number | null;
    status: string;
    simklId: number;    
}

const MovieSchema: Schema = new Schema({
    title: { type: String, required: true },
    userRating: { type: Number, required: true },
    status: { type: String, required: true },
    simklId: { type: Number, required: true }
});

export default mongoose.model<IMovie>('Movie', MovieSchema);