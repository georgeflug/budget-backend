import { DbRecord, dbRecordSchema } from '../db/json-db'
import Joi from 'joi'

export type UnsavedFeatureIdea = {
  description: string
}

export type FeatureIdea = DbRecord & UnsavedFeatureIdea

export const featureIdeaSchema = dbRecordSchema.keys({
  description: Joi.string(),
})
