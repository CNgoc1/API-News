const endpointsJson = require("../endpoints.json");
require("jest-sorted");

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
});

describe("Get /api/invalid", () => {
  test("404: Responds with not found when given invalid endpoint", () => {
    return request(app)
      .get("/api/invalid")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: responds with all articles in order of date", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSorted({ key: "created_at", descending: true });
        articles.forEach((article) => {
          expect(article.body).toBeUndefined(),
            expect(article).toEqual({
              article_id: expect.any(Number),
              created_at: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              article_img_url: expect.any(String),
              votes: expect.any(Number),
            });
        });
      });
  });
});

describe("GET /api/articles/(query)", () => {
  test("200: responds with specific article based on ID", () => {
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
  test("400: responds with bad request when given invalid article ID", () => {
    return request(app)
      .get("/api/articles/invalid")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toEqual("Bad request");
      });
  });
  test("404: responds with bad request when given non existent article id", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toEqual("Not found");
      });
  });
  test("200: responds with comments of article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSorted({ key: "created_at", descending: true });
        comments.forEach((comment) => {
          expect(comment).toEqual({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });
  test("200: responds with no comments of a valid article_id", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
      });
  });
});

describe("POST /api/articles/:article_id/comment", () => {
  test("201: adds and responds with the new comment", () => {
    const comment = {
      username: "butter_bridge",
      body: "I am testing for status code 201 wish me good luck",
      article_id: 2,
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(comment)
      .expect(201)
      .then(({ body }) => {
        expect(body.body).toEqual({
          comment_id: 19,
          body: "I am testing for status code 201 wish me good luck",
          article_id: 2,
          author: "butter_bridge",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  test("400: responds with bad request when given missing properties", () => {
    const comment = {
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(comment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("404: responds with not found when username does not exist", () => {
    const comment = {
      username: "Christian",
      body: "Hello",
      article_id: 2,
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(comment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("User not found");
      });
  });
  test("404: responds with not found when article_id does not exist", () => {
    const comment = {
      username: "butter_bridge",
      body: "Hello",
      article_id: 999,
    };
    return request(app)
      .post("/api/articles/999/comments")
      .send(comment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: responds with added vote in updated article", () => {
    const updateArticle = { inc_Vote: 1 };
    return request(app)
      .patch("/api/articles/1")
      .send(updateArticle)
      .expect(200)
      .then(({ body: { body } }) => {
        expect(body.votes).toEqual(101);
        expect(body.article_id).toEqual(1);
      });
  });

  test("200: responds with subtracted vote in updated article", () => {
    const updateArticle = { inc_Vote: -1 };
    return request(app)
      .patch("/api/articles/1")
      .send(updateArticle)
      .expect(200)
      .then(({ body: article }) => {
        expect(article.body.votes).toEqual(99);
        expect(article.body.article_id).toEqual(1);
      });
  });

  test("400: responds with bad request when given invalid vote inc", () => {
    const updateArticle = { inc_Vote: "Invalid" };
    return request(app)
      .patch("/api/articles/1")
      .send(updateArticle)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toEqual("Bad request");
      });
  });

  // previously did 404 non existent article_id
});
