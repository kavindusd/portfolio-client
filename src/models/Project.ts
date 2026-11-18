import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  tags: string[];
  category: 'Fullstack' | 'Frontend' | 'Mobile' | 'Design';
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  overview?: string;
  role?: string;
  client?: string;
  features?: string[];
  deliverables?: string[];
  gallery?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      enum: ['Fullstack', 'Frontend', 'Mobile', 'Design'],
      default: 'Fullstack',
    },
    imageUrl: {
      type: String,
      default: '/avatar.png',
    },
    liveUrl: {
      type: String,
      default: '',
    },
    githubUrl: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    overview: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      default: '',
    },
    client: {
      type: String,
      default: '',
    },
    features: {
      type: [String],
      default: [],
    },
    deliverables: {
      type: [String],
      default: [],
    },
    gallery: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export const Project: Model<IProject> =
  (mongoose.models.Project as Model<IProject>) || mongoose.model<IProject>('Project', ProjectSchema);
