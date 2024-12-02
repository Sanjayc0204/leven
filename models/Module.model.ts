import mongoose, { Document, Schema, Model } from "mongoose";

// Interface for the Module document with flexible customizations
export interface IModule extends Document {
  name: string;
  image: string;
  description: string;
  moduleType: string;
  tags: string[]; 
  customizations: {
    [key: string]: any; // Index signature allows any key-value pairs within customizations
  };
  createdAt: Date;
}

// Define the Module schema
const ModuleSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true},
  description: {type: String, required: true},
  moduleType: { type: String, required: true }, 
  tags: { type: [String], default: [] },
  customizations: { type: Object, required: true, default: {} }, // Flexible structure for customizations
  createdAt: { type: Date, default: Date.now },
});

const Module: Model<IModule> =
  mongoose.models?.Module || mongoose.model<IModule>("Module", ModuleSchema);
export default Module;
