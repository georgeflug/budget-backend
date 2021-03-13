import { listFeatureIdeas, saveFeatureIdea } from './feature-idea-service'
import { ServerRoute } from '@hapi/hapi'

export const featureIdeaRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/feature-ideas',
    handler: async () => await listFeatureIdeas(),
  },
  {
    method: 'POST',
    path: '/feature-ideas',
    handler: async request => await saveFeatureIdea(request.payload as { description: string }),
  },
]
