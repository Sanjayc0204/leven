import mongoose, { Document, Schema, Model, Types } from "mongoose";

// Define interfaces for subdocuments
interface IModuleProgress {
  moduleId: mongoose.Types.ObjectId;
  totalPoints: number;
  totalTime: number;
}

interface IMember {
  _id: mongoose.Types.ObjectId;
  role: "admin" | "member";
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

// Define the main Community interface
export interface ICommunity extends Document {
  name: string;
  slug: string;
  description: string;
  image: string;
  creator_ID: mongoose.Types.ObjectId;
  members: IMember[];
  customization: ICustomization[];
  modules: ICommunityModule[];
  settings: object;
  createdAt: Date;
}

// Define the schema with optimized fields
const CommunitySchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true},
  description: { type: String, default: "" },
  image: { type: String, default: "" },
  creator_ID: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  }, // Indexed for faster lookups
  members: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      }, // Indexed for querying by member
      role: { type: String, enum: ["admin", "member"], default: "member" },
      points: { type: Number, default: 0 },
      moduleProgress: [
        {
          moduleId: {
            type: mongoose.Types.ObjectId,
            ref: "Module",
            required: true,
          },
          totalPoints: { type: Number, default: 0 },
          totalTime: { type: Number, default: 0 },
        },
      ],
    },
  ],
  customization: [
    {
      moduleId: {
        type: mongoose.Types.ObjectId,
        ref: "Module",
        required: true,
      },
      pointsScheme: { type: Object, default: {} },
    },
  ],
  modules: [
    {
      moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
        required: true,
      },
      settings: { type: Object, default: {} },
    },
  ],
  settings: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
});

// Export model with the interface
const Community: Model<ICommunity> =
  mongoose.models.Community ||
  mongoose.model<ICommunity>("Community", CommunitySchema);

export default Community;