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

// Define an interface for a module within a community
interface ICommunityModule {
  moduleId: mongoose.Types.ObjectId;
  settings: object;
}

export interface ICommunity extends Document {   //export it to use in service layer
  name: string;
  description: string;
  image: string;
  creator_ID: mongoose.Types.ObjectId;
  members: IMember[];
  customization: ICustomization[];
  settings: object;
  modules: ICommunityModule[];  // <-- Add this to the interface
  createdAt: Date;
}

// Define the Community schema
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

// Export the model with the interface
const Community: Model<ICommunity> = mongoose.models.Community || mongoose.model<ICommunity>('Community', CommunitySchema);
export default Community;







// import mongoose from 'mongoose';

// const CommunitySchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: { type: String, default: '' }, // Description of the community
//   image: { type: String, default: '' }, // Image URL for the community
//   creator_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Creator of the community
//   members: [
//     {
//       _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Use _id for User ID
//       role: { type: String, enum: ['admin', 'member'], default: 'member' }, // Role in the community
//       points: { type: Number, default: 0 },
//       moduleProgress: [
//         {
//           moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
//           totalPoints: { type: Number, default: 0 },
//           totalTime: { type: Number, default: 0 },
//           _id: false // Disable _id for moduleProgress
//         }
//       ]
//     }
//   ],
//   customization: [
//     {
//       moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
//       pointsScheme: { type: Object }
//     }
//   ],
//   settings: { type: Object, default: {} }, // Default settings, can be customized later
//   createdAt: { type: Date, default: Date.now } // Timestamp of community creation
// });

// export default mongoose.models.Community || mongoose.model('Community', CommunitySchema);
