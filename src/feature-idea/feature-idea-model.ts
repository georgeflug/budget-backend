import { DbRecord } from "../db/json-db";

export type UnsavedFeatureIdea = {
  description: string
}

export type FeatureIdea = DbRecord & UnsavedFeatureIdea
