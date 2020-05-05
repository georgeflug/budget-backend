import { FeatureIdea } from "./feature-idea-model";
import { FeatureIdeaDbModel } from "./feature-idea-db-model";

export async function listFeatureIdeas(): Promise<FeatureIdea[]> {
  return await FeatureIdeaDbModel.find({}).exec();
}

export async function saveFeatureIdea(featureIdea: FeatureIdea) {
  const featureIdeaDbModel = new FeatureIdeaDbModel(featureIdea);
  await featureIdeaDbModel.save();
}
