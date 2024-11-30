# BizAway backend challenge

NestJS REST API for fetching trips, and manage a user collection of trips.

## Local project setup

```bash
# clone the repo
$ git clone git@github.com:caiusCitiriga/biz-away-be-test.git

# cd into it
$ cd biz-away-be-test

# install dependencies
$ npm i
```

## What's inside?

The project meets the requirements + the Bonus assignment, plus a series other small additions. The complete list is:

- an API that allows to search a trip from an origin to a destination and define a sort_by strategy
-

## Local project run

Before running the project, either locally or in Docker (described below), you'll
first have to declare the required environment variables in your profile:

- `BZA_DB_URL`: the mongodb connection string
- `BZA_DB_NAME`: the db name, if not existing will be created
- `BZA_JWT_SECRET`: the secret for the JWT tokens signing
- `BZA_TEST_USERNAME`: the auto seeded username for signing in the API
- `BZA_TEST_PASSWORD`: the auto seeded username password
- `BZA_REMOTE_API_KEY`: the remote api (BizAway trips api) key
- `BZA_GATEWAY_PORT`: the port in which to run the service
- `BZA_ENABLE_SWAGGER`: if you want swagger enabled or not (true suggested)
- `BZA_GATEWAY_ALLOWED_REST_ORIGINS`: comma separated allowed origins
- `BZA_GATEWAY_ACCEPT_UNKNOWN_ORIGINS`: whether to accept or not connections from unknown origins

```bash
# Example of environment configuration

export BZA_DB_NAME="biz-away-be-test"

# change this with actual connection string
export BZA_DB_URL="mongodb://<username>:<password>@<host>:27017"

export BZA_TEST_USERNAME="test-user"
export BZA_TEST_PASSWORD="password"
export BZA_JWT_SECRET="<your-jwt-signing-secret>"
export BZA_REMOTE_API_KEY="<your-remote-api-key>"

export BZA_GATEWAY_PORT=3000
export BZA_ENABLE_SWAGGER=true
# assuming running locally. Not for prod.
export BZA_GATEWAY_ALLOWED_REST_ORIGINS="*"
# assuming running locally. Not for prod.
export BZA_GATEWAY_ACCEPT_UNKNOWN_ORIGINS="true"
```

Now you can run the project by typing:

```sh
npm start
```

## Authentication

The first run will seed the test user declared in the environment, and you can use it to sign in. A JWT token will be returned that is meant to be used as Bearer authentication under the `Authorization: Bearer <tkn>` header. The endpoint for this is:

```
[POST] /api/auth/sign-in
```

It requires a simple DTO:

```json
{
  "username": "string",
  "password": "string"
}
```

You can easily do this, and interact with all the other endpoints through the Swagger UI at the following address:

```
http://localhost:3000/swagger
```

## Docker project run

## Run tests

For simplicity sake only unit tests for the `trip-planner.service` has been implemented.
These tests mock any external dependency (remote api service, repositories, etc) and will assert the following conditions:

- should be defined
- should sort trips by: fastest
- should sort trips by: cheapest
- should fetch and sort trips by: cheapest
- should fetch and sort trips by: fastest
- should handle remote api fetch error gracefully
- should handle remote api fetch unknown error gracefully
- should save a user trip
- should get user saved trips
- should delete a user saved trip
- should return 404 when deleting non existing trip

```bash
$ npm run test
```
