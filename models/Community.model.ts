import mongoose, { Document, Schema, Model } from 'mongoose';

// Define an interface for the Community document
interface IModuleProgress {
  moduleId: mongoose.Types.ObjectId;
  totalPoints: number;
  totalTime: number;
}

interface IMember {
  _id: mongoose.Types.ObjectId;
  role: 'admin' | 'member';
  points: number;
  moduleProgress: IModuleProgress[];
}

interface ICustomization {
  moduleId: mongoose.Types.ObjectId;
  pointsScheme: object;
}

export interface ICommunityModule {
  moduleId: mongoose.Types.ObjectId;
  settings: object;
}

export interface ICommunity extends Document {
  name: string;
  description: string;
  image: string;
  creator_ID: mongoose.Types.ObjectId;
  members: IMember[];
  customization: ICustomization[];
  settings: object;
  modules: ICommunityModule[];
  createdAt: Date;
}

const CommunitySchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  creator_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      role: { type: String, enum: ['admin', 'member'], default: 'member' },
      points: { type: Number, default: 0 },
      moduleProgress: [
        {
          moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
          totalPoints: { type: Number, default: 0 },
          totalTime: { type: Number, default: 0 },
          _id: false,
        },
      ],
    },
  ],
  customization: [
    {
      moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
      pointsScheme: { type: Object },
    },
  ],
  settings: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
});

// Ensure model registration happens once
const Community: Model<ICommunity> = mongoose.models.Community || mongoose.model<ICommunity>('Community', CommunitySchema);

export default Community;