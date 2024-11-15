import mongoose, { Document, Schema, Model, Types } from "mongoose";

// Define points scheme for module customizations
export interface PointsScheme {
  [difficulty: string]: number;
}

interface ICommunitySettings {
  streaks: {
    streakThreshold: number;       // Minimum consecutive days to apply multiplier, 1 means no bonus
    multiplier: number;            // Multiplier for streak bonus, default 1 (no bonus)
  };
  privacy?: {
    isPrivate: boolean;            // Whether the community is private
    inviteLink?: string;           // Unique invite link for private access
    inviteExpiration?: Date;       // Expiration date for invite link
  };
  leaderboard?: {
    showStreaks: boolean;          // Show streaks on leaderboard
  };
}

// Interface for module customizations within a community
export interface ICommunityModule {
  moduleId: mongoose.Types.ObjectId; // Reference to Module document
  moduleName: string;                // Name of the module (e.g., "Leetcode")
  customizations: {                  // Customizations applied within this community
    pointsScheme: PointsScheme;
    [key: string]: any;              // Allows any additional customization properties
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
  previousRank: number;
  currentStreak: number;           // Current streak of consecutive days
  longestStreak: number;           // Longest streak record
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
  settings: ICommunitySettings;
  createdAt: Date;
}

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
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
      role: { type: String, enum: ["admin", "member"], default: "member" },
      points: { type: Number, default: 0 },
      moduleProgress: [
        {
          moduleId: { type: mongoose.Types.ObjectId, ref: "Module", required: true },
          totalPoints: { type: Number, default: 0 },
          totalTime: { type: Number, default: 0 },
        },
      ],
      // New fields for tracking streaks
      currentStreak: { type: Number, default: 0 },  // Number of consecutive tasks or days
      longestStreak: { type: Number, default: 0 },  // Highest streak achieved
      previousRank: { type: Number, default: 0 },
      
    },
  ],
  modules: [
    {
      moduleId: { type: mongoose.Types.ObjectId, ref: "Module", required: true },
      moduleName: { type: String, required: true },
      settings: { type: Object, default: {} },
      customizations: {
        type: Schema.Types.Mixed,   // Mixed allows for any structure within customizations
        default: {}                 
      },
    },
  ],
  settings: {
    streaks: {
      streakThreshold: { type: Number, default: 1 },  // Minimum days/tasks for streak bonus
      multiplier: { type: Number, default: 1 },  // Multiplier for streak bonus, default 1
    },
    privacy: {
      isPrivate: { type: Boolean, default: false },
      inviteLink: { type: String, default: null },
      inviteExpiration: { type: Date, default: null },
    },
    leaderboard: {
      enabled: { type: Boolean, default: true },
      showStreaks: { type: Boolean, default: true },
    },
  },
  createdAt: { type: Date, default: Date.now },
});

// Export model with the interface
const Community: Model<ICommunity> =
  mongoose.models.Community ||
  mongoose.model<ICommunity>("Community", CommunitySchema);

export default Community;