import mongoose, { Schema, Document } from "mongoose";

interface IToken extends Document {
    accessToken: string;
    createdAt: Date;
}

const TokenSchema: Schema = new Schema({
    accessToken: { type: String, required: true },
    // createdAt: { type: Date, default: Date.now, expires: '1h' } 
    // Token expires after 1 hour
    createdAt: { type: Date, default: Date.now}
});

export default mongoose.model<IToken>('Token', TokenSchema);