import { listFeatureIdeas, saveFeatureIdea } from './feature-idea-service'
import { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import { featureIdeaSchema } from './feature-idea-model'

export const featureIdeaRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/feature-ideas',
    handler: async () => await listFeatureIdeas(),
    options: {
      response: {
        schema: Joi.array().items(featureIdeaSchema),
      },
    },
  },
  {
    method: 'POST',
    path: '/feature-ideas',
    handler: async request => await saveFeatureIdea(request.payload as { description: string }),
    options: {
      validate: {
        payload: Joi.object({
          description: Joi.string().required(),
        }),
      },
      response: {
        schema: featureIdeaSchema,
      },
    },
  },
]
