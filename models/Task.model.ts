import mongoose, {Document, Schema, Model} from "mongoose";

export interface ITask extends Document {
    userId: mongoose.Types.ObjectId;
    communityId: mongoose.Types.ObjectId;
    moduleId: mongoose.Types.ObjectId;
    description: string;
    completedAt: Date;
    duration?: number; // Only for time-based tasks
    points: number; // Calculated based on module’s points scheme or other customization
}

const TaskSchema: Schema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true, index: true },
    communityId: { type: mongoose.Types.ObjectId, ref: "Community", required: true, index: true },
    moduleId: { type: mongoose.Types.ObjectId, ref: "Module", required: true, index: true },
    description: { type: String, default: "" }, // Optional task description
    completedAt: { type: Date, default: Date.now, index: true },
    duration: { type: Number }, // Optional field for time-based tasks (e.g., session length in minutes)
    points: { type: Number, required: true }, // Points granted for the task
  });

const Task: Model<ITask> = mongoose.models?.Task || mongoose.model<ITask>("Task", TaskSchema);
export default Task;