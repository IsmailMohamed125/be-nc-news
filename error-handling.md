# Possible Errors

## Relevant HTTP Status Codes

- 200 OK
- 201 Created
- 204 No Content
- 400 Bad Request
- 404 Not Found
- 500 Internal Server Error

---

## The Express Documentation

[The Express Docs](https://expressjs.com/en/guide/error-handling.html) have a great section all about handling errors in Express.

## Unavailable Routes

### GET `/not-a-route`

- Status: 404

---

## Available Routes

### GET `/api/topics`

- Only internal server error possible

### POST `/api/topics`

- Body that does not contain the correct fields (e.g. `{}`)
- Bad `slug`

### GET `/api/articles`

- Bad queries:
  - `sort_by` a column that doesn't exist
  - `order` !== "asc" / "desc"
  - `topic` that is not in the database
  - `topic` that exists but does not have any articles associated with it
  - Bad `limit` (e.g. `limit=notANum`)
  - `limit` that is negative
  - Bad `p` (e.g. `p=notANum`)
  - `p` that is negative
  - `p` that is not found

### GET `/api/articles/:article_id`

- Bad `article_id` (e.g. `/dog`)
- Well formed `article_id` that doesn't exist in the database (e.g. `/999999`)

### GET `/api/articles/:article_id/comments`

- Bad `article_id` (e.g. `/dog`)
- Well formed `article_id` that doesn't exist in the database (e.g. `/999999`)
- Bad queries:
  - Bad `limit` (e.g. `limit=notANum`)
  - `limit` that is negative
  - Bad `p` (e.g. `p=notANum`)
  - `p` that is negative
  - `p` that is not found

### POST `/api/articles`

- Body that does not contain the correct fields (e.g. `{}`)
- Bad `author` (e.g. `999`)
- Well formed body but `author` that doesn't exist in the database (e.g. `bad_author`)
- Bad `topic` (e.g. `999`)
- Well formed body but `topic` that doesn't exist in the database (e.g. `bad_author`)

### PATCH `/api/articles/:article_id`

- Bad `article_id` (e.g. `/dog`)
- Well formed `article_id` that doesn't exist in the database (e.g. `/999999`)
- Invalid `inc_votes` (e.g. `{ inc_votes : "cat" }`)

### POST `/api/articles/:article_id/comments`

- Bad `article_id` (e.g. `/dog`)
- Well formed `article_id` that doesn't exist in the database (e.g. `/999999`)
- Body that does not contain the correct fields (e.g. `{}`)
- Well formed body but `username` that doesn't exist in the database (e.g. `bad_author`)

### PATCH `/api/comments/:comment_id`

- Bad `comment_id` (e.g. `/dog`)
- Well formed `comment_id` that doesn't exist in the database (e.g. `/999999`)
- Invalid `inc_votes` (e.g. `{ inc_votes : "cat" }`)

### DELETE `/api/comments/:comment_id`

- Bad `comment_id` (e.g. `/dog`)
- Well formed `comment_id` that doesn't exist in the database (e.g. `/999999`)

### GET `/api/users`

- Only internal server error possible

### GET `/api/users/:username`

- Well formed `username` that doesn't exist in the database (e.g. `/notauser`)
