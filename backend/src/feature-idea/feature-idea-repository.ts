import { FeatureIdea, UnsavedFeatureIdea } from "./feature-idea-model";
import { JsonDatabase } from "../db/json-db";

const db = new JsonDatabase<UnsavedFeatureIdea>("data/feature-idea");

export async function listFeatureIdeas(): Promise<FeatureIdea[]> {
  return await db.listRecords();
}

export async function saveFeatureIdea(featureIdea: UnsavedFeatureIdea): Promise<FeatureIdea> {
  return await db.createRecord(featureIdea);
}
