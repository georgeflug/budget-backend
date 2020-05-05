import { FeatureIdea } from "./feature-idea-model";
import * as repository from "./feature-idea-repository";

export async function saveFeatureIdea(idea: any): Promise<FeatureIdea> {
  const featureIdea: FeatureIdea = {
    date: new Date(),
    description: idea.description
  };
  await repository.saveFeatureIdea(featureIdea);
  return featureIdea;
}

export async function listFeatureIdeas(): Promise<FeatureIdea[]> {
  return await repository.listFeatureIdeas();
}
