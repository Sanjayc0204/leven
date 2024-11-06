import mongoose, { Document, Schema, Model, Types } from "mongoose";
import Task from "./Task.model";

// Define interfaces for subdocuments
interface IModuleProgress {
  moduleId: mongoose.Types.ObjectId;
  totalPoints: number;
  totalTime: number;
}

export interface PointsScheme {
  [difficulty: string]: number;
}

export interface UpdateData {
  customizations?: {
      pointsScheme?: PointsScheme;
  };
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

// Array of modules in community
export interface ICommunityModule {
  moduleId: mongoose.Types.ObjectId;
  moduleName: string;
  settings: object;
  customizations: {
    pointsScheme: PointsScheme;
};
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
      moduleId: { type: mongoose.Schema.Types.ObjectId, ref: "Module", required: true },
      moduleName: { type: String, required: true },  // Store the name of each module here
      settings: { type: Object, default: {} },       // Default settings specific to each module
      customizations: { type: Object, default: {} }  // Store module's points scheme or custom configurations
    },
  ],
  settings: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
});

// Post-delete hook to remove tasks associated with a community
CommunitySchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Task.deleteMany({ communityId: doc._id });
    console.log(`Deleted all tasks associated with community ${doc._id}`);
  }
});

// Export model with the interface
const Community: Model<ICommunity> =
  mongoose.models.Community ||
  mongoose.model<ICommunity>("Community", CommunitySchema);

export default Community;