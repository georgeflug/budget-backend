import { FeatureIdeaV2, UnsavedFeatureIdeaV2 } from "./feature-idea-model";
import { JsonDatabase } from "../db/json-db";

const db = new JsonDatabase<UnsavedFeatureIdeaV2>("data/feature-idea");

export async function listFeatureIdeas(): Promise<FeatureIdeaV2[]> {
  return await db.listRecords();
}

export async function saveFeatureIdea(featureIdea: UnsavedFeatureIdeaV2): Promise<FeatureIdeaV2> {
  return await db.createRecord(featureIdea);
}
