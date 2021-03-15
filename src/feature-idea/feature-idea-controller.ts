import { listFeatureIdeas, saveFeatureIdea } from './feature-idea-service'
import Joi from 'joi'
import { featureIdeaSchema } from './feature-idea-model'
import { ServerRoute } from '@hapi/hapi'

export const featureIdeaRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/feature-ideas',
    handler: async () => await listFeatureIdeas(),
    options: {
      tags: ['api'],
      response: {
        schema: Joi.array().items(featureIdeaSchema).label('Feature Idea List'),
      },
    },
  },
  {
    method: 'POST',
    path: '/feature-ideas',
    handler: async request => await saveFeatureIdea(request.payload as { description: string }),
    options: {
      tags: ['api'],
      validate: {
        payload: Joi.object({
          description: Joi.string().required(),
        }).label('Feature Item Creation'),
      },
      response: {
        schema: featureIdeaSchema,
      },
    },
  },
]
