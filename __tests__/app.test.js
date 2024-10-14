const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

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
