import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import { ICommunity } from '@/models/Community.model'; // Assuming you have this interface
import Community from '@/models/Community.model';  // Ensure correct path


// Define an interface for the User document
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  image?: string;
  // Here, the communities can be either an array of ObjectIds (before population)
  // or an array of populated ICommunity objects (after population).
  communities: (Types.ObjectId | Pick<ICommunity, '_id' | 'name'>)[];
  settings: {
    theme: string;
    notifications: boolean;
  };
  last_login_date: Date;
  created_date: Date;
}

// Define the User schema
const UserSchema: Schema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required!'],
    match: [/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/, 'Username invalid, it should contain 8-20 alphanumeric letters and be unique!'],
  },
  email: {
    type: String,
    unique: [true, 'Email already exists!'],
    required: [true, 'Email is required!'],
  },
  image: {
    type: String,
  },
  communities: [{ type: Schema.Types.ObjectId, ref: 'Community' }],  // Properly reference 'Community'
  settings: {
    theme: { type: String, default: 'light' },
    notifications: { type: Boolean, default: true },
  },
  last_login_date: { type: Date, default: Date.now },
  created_date: { type: Date, default: Date.now },
});

// Export the model with the interface
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;






















// import { Schema, model, models } from 'mongoose';

// const UserSchema = new Schema({
//   username: { 
//     type: String,
//     required: [true, 'Username is required!'],
//     match: [/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/, "Username invalid, it should contain 8-20 alphanumeric letters and be unique!"]
//    },

//   email: { 
//     type: String,
//     unique: [true, 'Email already exists!'],
//     required: [true, 'Email is required!'],
//   },
  
//   image: {
//     type: String
//   },

//   communities: [{ 
//     type: Schema.Types.ObjectId, ref: 'Community' }],

//   settings: {
//     theme: { 
//       type: String,
//       default: 'light' },  // Store user’s preferred theme

//     notifications: { type: Boolean, default: true }, // Notification settings
//     // Add more settings as needed
//   },

//   last_login_date: { type: Date, default: Date.now},
//   created_date: { type: Date, default: Date.now },
// });

// const User = models.User || model("User", UserSchema);

// export default User;



