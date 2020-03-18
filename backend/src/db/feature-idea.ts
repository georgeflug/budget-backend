import mongoose from 'mongoose';

export interface FeatureIdea extends mongoose.Document {
  date: Date,
  description: string
}

var FeatureIdeaSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  description: String,
});

export const FeatureIdeaDbModel = mongoose.model('FeatureIdea', FeatureIdeaSchema);
