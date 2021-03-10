import request from 'supertest';
import express from 'express';

const app = express();
app.use(express.json());
app.use(require('./feature-idea-controller').featureIdeaRoute.router);

describe('Feature Idea Controller', () => {

  it('should save a feature idea', async () => {
    // no setup

    // todo: this saves data in the data folder. needs to go somewhere else.
    // const res = await request(app)
    //   .post('/feature-ideas')
    //   .send({
    //     description: 'test-description',
    //   });

    // expect(res.statusCode).toEqual(200);
    // TODO:
    // expect(res.body).toEqual(expect.objectContaining({
    //   description: 'test-description',
    //   version: 1,
    //   recordId: expect.any(Number)
    // }));
  });

});
