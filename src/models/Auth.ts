import mongoose, { Schema, Document, Model } from "mongoose";


export interface IAuth extends Omit<Document, "_id"> {
  _id: string;
  client_id: string;
  login: string;
  pwd: string;
}

const authSchema = new Schema<IAuth>({
  _id: { type: String, required: true },
  client_id: { type: String, required: true },
  login: { type: String, required: true, unique: true },
  pwd: { type: String, required: true }
}, { _id: false });

// on verif si le model n'existe pas deja
const Auth: Model<IAuth> = 
  mongoose.models.Auth || mongoose.model<IAuth>("Auth", authSchema, "auth");

export default Auth;