import { FeatureIdeaV2, UnsavedFeatureIdeaV2 } from "./feature-idea-model";
import * as repository from "./feature-idea-repository";

export async function saveFeatureIdea(idea: any): Promise<FeatureIdeaV2> {
  const featureIdea: UnsavedFeatureIdeaV2 = {
    description: idea.description
  };
  return await repository.saveFeatureIdea(featureIdea);
}

export async function listFeatureIdeas(): Promise<FeatureIdeaV2[]> {
  return await repository.listFeatureIdeas();
}
