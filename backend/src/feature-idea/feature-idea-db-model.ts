import mongoose from 'mongoose';
import { FeatureIdea } from "./feature-idea-model";

export type DbFeatureIdea = FeatureIdea & mongoose.Document;

var FeatureIdeaSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  description: String,
});

export const FeatureIdeaDbModel = mongoose.model<DbFeatureIdea>('FeatureIdea', FeatureIdeaSchema);
