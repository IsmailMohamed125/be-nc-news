const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json");

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("All Bad Endpoints", () => {
  test("GET:404 - Responds with a status of 404 and a message of 'Route not found!'", () => {
    return request(app)
      .get("/api/BAD-ENDPOINT")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found!");
      });
  });
  test("POST:404 - Responds with a status of 404 and a message of 'Route not found!'", () => {
    return request(app)
      .post("/api/BAD-ENDPOINT")
      .send({})
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found!");
      });
  });
  test("PATCH:404 - Responds with a status of 404 and a message of 'Route not found!'", () => {
    return request(app)
      .patch("/api/BAD-ENDPOINT")
      .send({})
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found!");
      });
  });
  test("DELETE:404 - Responds with a status of 404 and a message of 'Route not found!'", () => {
    return request(app)
      .delete("/api/BAD-ENDPOINT")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found!");
      });
  });
});

describe("API Endpoint", () => {
  describe("GET:/api", () => {
    test("GET:200 - Responds with an object detailing all of the available API endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body.endpoints).toEqual(endpoints);
        });
    });
  });
});

describe("Topics Endpoint", () => {
  describe("GET:/api/topics", () => {
    test("GET:200 - Responds with an array containing correctly formated topics objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const topics = body.topics;
          expect(topics.length).not.toBe(0);
          topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
  });
});

describe("Articles Endpoint", () => {
  describe("GET:/api/articles", () => {
    test("GET:200 - Responds with an array containing correctly formated article objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;

          expect(articles.length).not.toBe(0);
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(Number),
              })
            );
          });
        });
    });
    test("GET:200 - Responds with an array containing correctly formated article objects sorted by date in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
  });
  describe("GET:/api/articles/:article_id", () => {
    test("GET:200 - Responds with an array containing correctly formated article object", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const article = body.article[0];

          expect(article).toEqual(
            expect.objectContaining({
              article_id: 1,
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
            })
          );
        });
    });
    test("GET:404 - Responds with an error when attempting to GET a resource by a valid ID that does not exist in the database", () => {
      return request(app)
        .get("/api/articles/999999999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article with id 999999999 not found");
        });
    });
    test("GET:400 - Responds with an error when attempting to GET a resource by an invalid ID", () => {
      return request(app)
        .get("/api/articles/notAnId")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request: Invalid category type");
        });
    });
  });
  describe("GET:/api/articles/:article_id/comments", () => {
    test("GET:200 - Responds with an array containing correctly formated comment objects", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const comments = body.comments;
          console.log(comments);
          expect(comments.length).not.toBe(0);
          comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                author: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                body: expect.any(String),
                article_id: expect.any(Number),
              })
            );
          });
        });
    });
  });
});
