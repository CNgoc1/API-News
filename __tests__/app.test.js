const endpointsJson = require("../endpoints.json");

/* Set up your test imports here */
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

/* Set up your beforeEach & afterAll functions here */
beforeEach(async () => {
  await seed(testData);
});
afterAll(async () => {
  await db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const endpoints = response.body.endpoints;
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an object of all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(Array.isArray(topics)).toBe(true);
        expect(topics.length).toEqual(3);
        topics.forEach((topic) => {
          expect(topic.slug).toBeDefined();
          expect(topic.description).toBeDefined();
        });
      });
  });

  test("404: Responds with not found when given invalid endpoint", () => {
    return request(app)
      .get("/api/invalid")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
});
