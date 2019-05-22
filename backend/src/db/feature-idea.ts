import mongoose from 'mongoose';

const Schema = mongoose.Schema;

var FeatureIdeaSchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  description: String,
});

export default mongoose.model('FeatureIdea', FeatureIdeaSchema);
