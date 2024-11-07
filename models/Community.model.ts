import mongoose, { Document, Schema, Model, Types } from "mongoose";
import Task from "./Task.model";

// Define points scheme for module customizations
export interface PointsScheme {
  [difficulty: string]: number;
}

// Interface for module customizations within a community
export interface ICommunityModule {
  moduleId: mongoose.Types.ObjectId; // Reference to Module document
  moduleName: string;                // Name of the module (e.g., "Leetcode")
  settings: object;                  // Any additional settings for the module
  customizations: {                  // Customizations applied within this community
    pointsScheme: PointsScheme;
  };
}

// Interface for tracking member progress in modules
interface IModuleProgress {
  moduleId: mongoose.Types.ObjectId;
  totalPoints: number;
  totalTime: number;
}

// Interface for community members
interface IMember {
  _id: mongoose.Types.ObjectId;
  role: "admin" | "member";
  points: number;
  moduleProgress: IModuleProgress[];
}

// Main Community interface after consolidation
export interface ICommunity extends Document {
  name: string;
  slug: string;
  description: string;
  image: string;
  creator_ID: mongoose.Types.ObjectId;
  members: IMember[];
  modules: ICommunityModule[]; // Contains both module references and customizations
  settings: object;
  createdAt: Date;
}

// Optional update structure for customizations, if needed for updating purposes
export interface UpdateData {
  customizations?: {
    pointsScheme?: PointsScheme;
  };
}

// Define the schema with optimized fields
const CommunitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  description: { type: String, default: "" },
  image: { type: String, default: "" },
  creator_ID: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  members: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },
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
  modules: [
    {
      moduleId: { type: mongoose.Types.ObjectId, ref: "Module", required: true },
      moduleName: { type: String, required: true },
      settings: { type: Object, default: {} }, // For future use, maybe useful
      customizations: {
        pointsScheme: { type: Map, of: Number, default: {} },  // Allow flexible keys with numeric values
      },
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