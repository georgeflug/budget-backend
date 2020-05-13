import { DbRecord } from "../db/json-db";

export interface FeatureIdea {
  date: Date,
  description: string
}

export type UnsavedFeatureIdeaV2 = {
  description: string
}

export type FeatureIdeaV2 = DbRecord & UnsavedFeatureIdeaV2
