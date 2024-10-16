# Northcoders News API

Link: https://ismails-news.onrender.com/api

Summary: I've built a RESTful API to provide programmatic access to news-related application data. This project simulates the development of a real-world backend service, similar to platforms like Reddit, where users can access and interact with data through API endpoints. The API will allow clients (such as frontend applications) to retrieve and manipulate data such as articles, comments, users, and topics.

Instructions:
Cloning - Navigate to the desired directory and use git clone https://github.com/IsmailMohamed125/be-nc-news.git
Environment variables - Create three .env files called: .env.test, .env.development and .env.production and have the PGDATABASE or DATABASE_URL variable set to the respective databases depending on the environment
Install dependencies - npm install
Seed local database - In devolopment mode run : npm run seed. In production mode run: npm run seed-prod. For all test cases seeding of the database is handled in the test files.
Test - Run npm test for all test suites to be ran or run npm test app || utils to test each file seperately

Minimum version of Node.js required: 10.x Recommend to use newer LTS version
Minimum version of Postgres required: 9.5

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
