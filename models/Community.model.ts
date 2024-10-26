import mongoose, { Document, Schema, Model, Types } from 'mongoose';

// Define interfaces for subdocuments
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

// Define the main Community interface
export interface ICommunity extends Document {
  name: string;
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
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  creator_ID: { type: mongoose.Types.ObjectId, ref: 'User', required: true, index: true }, // Indexed for faster lookups
  members: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, // Indexed for querying by member
      role: { type: String, enum: ['admin', 'member'], default: 'member' },
      points: { type: Number, default: 0 },
      moduleProgress: [
        {
          moduleId: { type: mongoose.Types.ObjectId, ref: 'Module', required: true },
          totalPoints: { type: Number, default: 0 },
          totalTime: { type: Number, default: 0 },
        },
      ],
    },
  ],
  customization: [
    {
      moduleId: { type: mongoose.Types.ObjectId, ref: 'Module', required: true },
      pointsScheme: { type: Object, default: {} },
    },
  ],
  modules: [
    {
      moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
      settings: { type: Object, default: {} },
    },
  ],
  settings: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
});

// Export model with the interface
const Community: Model<ICommunity> = mongoose.models.Community || mongoose.model<ICommunity>('Community', CommunitySchema);

export default Community;







// import mongoose, { Document, Schema, Model } from 'mongoose';
// import { kebabCase } from 'lodash';  // Optional: use lodash for kebab case transformation

// // Define an interface for the Community document
// interface IModuleProgress {
//   moduleId: mongoose.Types.ObjectId;
//   totalPoints: number;
//   totalTime: number;
// }

// interface IMember {
//   _id: mongoose.Types.ObjectId;
//   role: 'admin' | 'member';
//   points: number;
//   moduleProgress: IModuleProgress[];
// }

// interface ICustomization {
//   moduleId: mongoose.Types.ObjectId;
//   pointsScheme: object;
// }

// export interface ICommunityModule {
//   moduleId: mongoose.Types.ObjectId;
//   settings: object;
// }

// // Define the Community interface, adding the slug field
// export interface ICommunity extends Document {
//   name: string;
//   description: string;
//   image: string;
//   slug: string;  // Slug field added here
//   creator_ID: mongoose.Types.ObjectId;
//   members: IMember[];
//   customization: ICustomization[];
//   settings: object;
//   modules: ICommunityModule[];
//   createdAt: Date;
// }

// const CommunitySchema: Schema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: { type: String, default: '' },
//   image: { type: String, default: '' },
//   slug: { type: String, unique: true },  // Slug field with unique constraint
//   creator_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   members: [
//     {
//       _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//       role: { type: String, enum: ['admin', 'member'], default: 'member' },
//       points: { type: Number, default: 0 },
//       moduleProgress: [
//         {
//           moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
//           totalPoints: { type: Number, default: 0 },
//           totalTime: { type: Number, default: 0 },
//           _id: false,
//         },
//       ],
//     },
//   ],
//   customization: [
//     {
//       moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
//       pointsScheme: { type: Object },
//     },
//   ],
//   settings: { type: Object, default: {} },
//   createdAt: { type: Date, default: Date.now },
// });

// // Pre-save hook to generate a slug from the name
// CommunitySchema.pre<ICommunity>('save', async function (next) {
//   // Only generate slug if the name is modified or if this is a new document
//   if (this.isNew || this.isModified('name')) {
//     // Generate slug in kebab case (e.g., "Leetcode Community BYU" => "leetcode-community-byu")
//     const baseSlug = kebabCase(this.name);

//     // Check for existing communities with the same slug to ensure uniqueness
//     let uniqueSlug = baseSlug;
//     let count = 1;

//     while (await Community.exists({ slug: uniqueSlug })) {
//       uniqueSlug = `${baseSlug}-${count}`;
//       count++;
//     }

//     this.slug = uniqueSlug;  // Set the unique slug
//   }
//   next();
// });

// // Export the model with the interface
// const Community: Model<ICommunity> = mongoose.models.Community || mongoose.model<ICommunity>('Community', CommunitySchema);
// export default Community;
