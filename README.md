# Northcoders News API

The production database is hosted on [Superbase](https://supabase.com/) and the API is hosted on Render [Ismail's News API](https://ismails-news.onrender.com/api).

## Summary

I've built a RESTful API to provide programmatic access to news-related application data. This project simulates the development of a real-world backend service, similar to platforms like Reddit, where users can access and interact with data through API endpoints. The API will allow clients (such as frontend applications) to retrieve and manipulate data such as articles, comments, users, and topics.

## Instructions

**Cloning** - Navigate to the desired directory and use `git clone https://github.com/IsmailMohamed125/be-nc-news.git`

**Environment variables** - Create three .env files called: `.env.test`, `.env.development` and `.env.production` and have the `PGDATABASE` or `DATABASE_URL` variable set to the respective databases depending on the environment

**Install dependencies** - `npm install`

**Seed local database** - In devolopment mode run : `npm run seed`. In production mode run: `npm run seed-prod`. For all test cases seeding of the database is handled in the test files

**Test** - Run `npm test` for all test suites to be ran or run `npm test app` or `npm test utils` to test each file seperately

## Prerequisites

- Node.js >= 10.x _RECOMMEND TO USE NEWER LTS VERSION_
- npm >= 6.x _RECOMMEND TO USE NEWER LTS VERSION_
- Postgres >= 9.5

### Installation Instructions

1. **Install Node.js**:
   - Visit the [Node.js website](https://nodejs.org/en) to download and install
2. **Install PSQL**:
   - Visit the [Postgresql website](https://www.postgresql.org/download/) to download and install

## Error handling

Refer to [Error Handling Guide](./error-handling.md)

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
