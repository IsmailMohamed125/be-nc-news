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
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Route not found!");
      });
  });
  test("POST:404 - Responds with a status of 404 and a message of 'Route not found!'", () => {
    return request(app)
      .post("/api/BAD-ENDPOINT")
      .send({})
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Route not found!");
      });
  });
  test("PATCH:404 - Responds with a status of 404 and a message of 'Route not found!'", () => {
    return request(app)
      .patch("/api/BAD-ENDPOINT")
      .send({})
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Route not found!");
      });
  });
  test("DELETE:404 - Responds with a status of 404 and a message of 'Route not found!'", () => {
    return request(app)
      .delete("/api/BAD-ENDPOINT")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Route not found!");
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
        .then(({ body: { topics } }) => {
          expect(topics.length).not.toBe(0);
          topics.forEach((topic) => {
            expect(topic).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
            });
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
        .then(({ body: { articles } }) => {
          expect(articles.length).not.toBe(0);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
        });
    });
    test("GET:200 - Responds with an array containing correctly formated article objects sorted by date in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    describe("Sorting", () => {
      describe("Sort by category", () => {
        test("GET:200 - Responds with an array containing array objects sorted by the query parameter defaualting to DESC order", () => {
          return request(app)
            .get("/api/articles?sort_by=votes")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSortedBy("votes", {
                descending: true,
              });
            });
        });
        test("GET:400 - Responds with an error message when trying to sort with an invalid query parameter", () => {
          return request(app)
            .get("/api/articles?sort_by=bad_query")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid sort_by column");
            });
        });
      });
      describe("Order", () => {
        test("GET:200 - Responds with an array containing array objects sorted by the defaualt column (created_at) in the order direction provided", () => {
          return request(app)
            .get("/api/articles?order=asc")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSortedBy("created_at");
            });
        });
        test("GET:400 - Responds with an error message when trying to sort with an invalid query parameter", () => {
          return request(app)
            .get("/api/articles?order=bad_request")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid order direction");
            });
        });
      });
      test("GET:200 - Responds with an array containing array objects sorted by the query parameter in the order direction", () => {
        return request(app)
          .get("/api/articles?sort_by=votes&order=asc")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("votes");
          });
      });
    });
    describe("Filtering by topic", () => {
      test("GET:200 - Responds with an array containing correctly formated article objects with all objects having a topic matching the query parameter", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).not.toBe(0);
            articles.forEach((article) => {
              expect(article).toMatchObject({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: "mitch",
                author: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(Number),
              });
            });
          });
      });
      test("GET:200 - Responds with an empty array containing when no articles match a valid topic query parameter", () => {
        return request(app)
          .get("/api/articles?topic=paper")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toEqual([]);
          });
      });
      test("GET:404 - Responds with an error when passed a topic not present in our database", () => {
        return request(app)
          .get("/api/articles?topic=bad_request")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Not found");
          });
      });
    });
  });
  describe("GET:/api/articles/:article_id", () => {
    test("GET:200 - Responds with an array containing correctly formated article object", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article[0]).toMatchObject({
            article_id: 1,
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: 11, // From comments test data
          });
        });
    });
    test("GET:404 - Responds with an error when attempting to GET a resource by a valid ID that does not exist in the database", () => {
      return request(app)
        .get("/api/articles/999999999")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not found");
        });
    });
    test("GET:400 - Responds with an error when attempting to GET a resource by an invalid ID", () => {
      return request(app)
        .get("/api/articles/notAnId")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
  });
  describe("GET:/api/articles/:article_id/comments", () => {
    test("GET:200 - Responds with an array containing correctly formated comment objects", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).not.toBe(0);
          comments.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              body: expect.any(String),
              article_id: expect.any(Number),
            });
          });
        });
    });
    test("GET:200 - Responds with an array containing comment objects sorted by date in descending order", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("GET:200 - Responds with an empty array when given a valid article id with no comments on article", () => {
      return request(app)
        .get("/api/articles/7/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toEqual([]);
        });
    });
    test("GET:404 - Responds with an error when attempting to GET a resource by a valid ID that does not exist in the database", () => {
      return request(app)
        .get("/api/articles/999999999/comments")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not found");
        });
    });
    test("GET:400 - Responds with an error when attempting to GET a resource by an invalid ID", () => {
      return request(app)
        .get("/api/articles/notAnId/comments")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
  });
  describe("POST:/api/articles/:article_id/comments", () => {
    test("POST:201 - Responds with an array containing correctly formated comment object", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "butter_bridge",
          body: "This is a test comment",
        })
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment[0]).toMatchObject({
            comment_id: expect.any(Number),
            author: "butter_bridge",
            created_at: expect.any(String),
            votes: 0,
            body: "This is a test comment",
            article_id: 1,
          });
        });
    });
    test("POST:400 - Responds with an error when attempting to POST request with a body that does not contain the correct fields", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({})
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test.only("POST:400 - Responds with an error when attempting to make a POST request with valid fields but the value of the username field is invalid", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "bad_user",
          body: "test",
        })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not found");
        });
    });
    test("POST:404 - Responds with an error when attempting to POST a resource by a valid ID that does not exist in the database", () => {
      return request(app)
        .post("/api/articles/999999999/comments")
        .send({
          username: "butter_bridge",
          body: "This is a test comment",
        })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not found");
        });
    });
    test("POST:400 - Responds with an error when attempting to POST a resource by an invalid ID", () => {
      return request(app)
        .post("/api/articles/notAnId/comments")
        .send({
          username: "butter_bridge",
          body: "This is a test comment",
        })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
  });
  describe("PATCH:/api/articles/:article_id", () => {
    test("PATCH:200 - Responds with an array containing correctly formated comment object", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 2 })
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article[0]).toMatchObject({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 102,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    test("PATCH:400 - Responds with an error when attempting to PATCH a resource with a body that does not contain the correct fields", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({})
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("PATCH:400 - Responds with an error when attempting to make a POST request with valid fields but the value of a field is invalid", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "notAnINT" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("PATCH:404 - Responds with an error when attempting to PATCH a resource by a valid ID that does not exist in the database", () => {
      return request(app)
        .patch("/api/articles/999999999")
        .send({ inc_votes: 2 })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not found");
        });
    });
    test("PATCH:400 - Responds with an error when attempting to PATCH a resource by an invalid ID", () => {
      return request(app)
        .patch("/api/articles/notAnId")
        .send({ inc_votes: 2 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
  });
});

describe("Comments Endpoint", () => {
  describe("DELETE:/api/comments/:comment_id", () => {
    test("DELETE:204 - Responds with no content", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({});
        });
    });
    test("DELETE: 404 - Attempting to DELETE a resource that does not exist", () => {
      return request(app)
        .delete("/api/comments/999999")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not found");
        });
    });
    test("DELETE: 400 - Attempting to DELETE a resource referenced by an invalid ID", () => {
      return request(app)
        .delete("/api/comments/notAnId")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
  });
});

describe("Users Endpoint", () => {
  describe("GET:/api/users", () => {
    test("GET:200 - Responds with an array containing correctly formated user objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users.length).toBe(4);
          users.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });
  });
  describe("GET:/api/users/:username", () => {
    test("GET:200 - Responds with a correctly formated user object with username provided", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user[0]).toMatchObject({
            username: "butter_bridge",
            name: "jonny",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          });
        });
    });
    test("GET:404 - Responds with an error when attempting to GET a user by a username that does not exist", () => {
      return request(app)
        .get("/api/users/fake_user")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not found");
        });
    });
  });
});
