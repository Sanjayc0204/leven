import mongoose, { Document, Schema, Model } from 'mongoose';

// Define an interface for the Module document
export interface IModule extends Document {
  name: string;
  moduleType: string;
  settings: object;
  customizations: {
    pointsScheme: object;
  };
  createdAt: Date;
}

// Define the Module schema
const ModuleSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  moduleType: { type: String, required: true },
  settings: { type: Object },
  customizations: {
    pointsScheme: { type: Object },
  },
  createdAt: { type: Date, default: Date.now },
});

// Export the model with the interface
const Module: Model<IModule> = mongoose.models.Module || mongoose.model<IModule>('Module', ModuleSchema);
export default Module;



// import mongoose from 'mongoose';

// const ModuleSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   moduleType: { type: String, required: true }, // e.g., 'focus_timer'
//   settings: { type: Object }, // Flexible settings specific to module type
//   customizations: {
//     pointsScheme: { type: Object } // Flexible points scheme based on module type
//   },
//   createdAt: { type: Date, default: Date.now },
// });

// export default mongoose.models.Module || mongoose.model('Module', ModuleSchema);
