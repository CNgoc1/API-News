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
  test("404: Responds with not found when given invalid endpoint", () => {
    return request(app)
      .get("/api/invalid")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
});

describe.only("GET /api/articles/(query)", () => {
  test("200: Responds with specific article based on ID", () => {
    const result = {
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      article_id: 1,
      body: "I find this existence challenging",
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.title).toEqual(result.title);
        expect(article.topic).toEqual(result.topic);
        expect(article.author).toEqual(result.author);
        expect(article.article_id).toEqual(result.article_id);
        expect(article.body).toEqual(result.body);
        expect(article.article_img_url).toEqual(result.article_img_url);
      });
  });
  test("400: Responds with bad request when given invalid article ID", () => {
    return request(app)
      .get("/api/articles/invalid")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toEqual("Bad request");
      });
  });

  test("404: Responds with bad request when given non existent article id", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toEqual("Not found");
      });
  });
});
