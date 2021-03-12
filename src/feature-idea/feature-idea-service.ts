import { FeatureIdea, UnsavedFeatureIdea } from './feature-idea-model'
import * as repository from './feature-idea-repository'

export async function saveFeatureIdea(idea: { description: string }): Promise<FeatureIdea> {
  const featureIdea: UnsavedFeatureIdea = {
    description: idea.description,
  }
  return await repository.saveFeatureIdea(featureIdea)
}

export async function listFeatureIdeas(): Promise<FeatureIdea[]> {
  return await repository.listFeatureIdeas()
}
