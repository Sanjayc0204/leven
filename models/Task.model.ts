import mongoose, {Document, Schema, Model} from "mongoose";

/**
 * ITask: Represents the structure of a saved task document in MongoDB. 
 * This is the schema you defined for Task, and it includes all properties that a stored task has. 
 * When you fetch a task from the database, it will be typed as ITask.
 */
export interface ITask extends Document {
    userId: mongoose.Types.ObjectId;
    communityId: mongoose.Types.ObjectId;
    moduleId: mongoose.Types.ObjectId;
    description: string;
    completedAt: Date;
    points: number;
    duration?:number;
    metadata?: string[];  // Array of tags related to the task
}


/**
 * TaskData: This is more of an input type for creating a task.
 * It includes extra fields, like taskType and difficulty, which might not be part of the stored Task document itself
 * but are necessary to calculate points. You could use TaskData when receiving data from the API request and passing 
 * it into functions before saving.
 */
export interface TaskData {
  userId: mongoose.Types.ObjectId;
  communityId: mongoose.Types.ObjectId;
  moduleId: mongoose.Types.ObjectId;
  points: number;
  description?: string;
  completedAt?: Date;
  duration?: number;
  metadata?: string[];  // Array of tags related to the task
}


const TaskSchema: Schema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true, index: true },
    communityId: { type: mongoose.Types.ObjectId, ref: "Community", required: true, index: true },
    moduleId: { type: mongoose.Types.ObjectId, ref: "Module", required: true, index: true },
    description: { type: String, default: "" }, // Optional task description
    completedAt: { type: Date, default: Date.now, index: true },
    duration: { type: Number }, // Optional field for time-based tasks (e.g., session length in minutes)
    points: { type: Number, required: true }, // Points granted for the task
    metadata: { type: [String], default: [] },  // Array of tags for flexible task attributes
  });

  
const Task: Model<ITask> = mongoose.models?.Task || mongoose.model<ITask>("Task", TaskSchema);
export default Task;