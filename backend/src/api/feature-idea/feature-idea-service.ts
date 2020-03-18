import {DbFeatureIdea, FeatureIdeaDbModel} from '../../db/feature-idea';

export async function saveFeatureIdea(idea: any): Promise<DbFeatureIdea> {
  var featureIdea = new FeatureIdeaDbModel(idea);
  return await featureIdea.save();
}

export async function listFeatureIdeas(): Promise<DbFeatureIdea[]> {
  return await FeatureIdeaDbModel.find({}).exec();
}
