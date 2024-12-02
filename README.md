# BizAway backend challenge

NestJS REST API for fetching trips, and manage a user collection of trips.

## What's inside?

The project meets the requirements & the Bonus assignment, plus a series other small additions. The complete list is:

- an API that allows to search a trip from an origin to a destination and define a sort_by strategy
- simple trip manager for saving, listing and deleting user trips
- validation of input dtos properties
- basic authentication module with JWT
- Jwt authentication guard. By default all endpoints are protected and can be made public via custom `@Public()` route decorator.
- custom route decorator for `@ReqUser()` the user issuing the request
- swagger open api for easy interaction with the API, and possible client side automatic code generation
- base return response, that standardize the returned response and a base response interceptor for automatic mapping
- Dockerfile and docker-compose for running everything with docker
- db connection with mongoose
- shared repositories modules for interaction ease
- simple environment config manager
- simple CORS management
- helmet for security against known http vulnerabilities
- throttler module for rate limiting (10 requests max per minute)

## Local project setup

```bash
# clone the repo
$ git clone git@github.com:caiusCitiriga/biz-away-be-test.git

# cd into it
$ cd biz-away-be-test

# install dependencies
$ npm i
```

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

## Swagger

The project has support for swagger. You can interact with every endpoint from the swagger UI and read the documentation, DTOs properties etc. The swagger UI is reachable at this address:

```
http://localhost:3000/swagger
```

Also, you can get the JSON OpenApi spec by calling:

```
http://localhost:3000/swagger-json
```

Useful if you want to use a client side library for automatically generating the http clients for calling the API like `ng-openapi-gen`

## Docker project run

To run the project with docker you can use docker compose. It will also spawn a mongodb service (without persistence volume). To do so, execute this command:

```sh
$ docker compose up
```

By default the database is configured like so:

```
Host port: 27017
Root username: root
Root password: root
```

Apart from the above values, the other configuration variables mentioned in the **Local project run** section are used by default.
You can change these values by editing the `docker-compose.yaml` file.

#### Note:

when running the project with docker, please set the correct host in the connection db string, which is the name of the mongo service in the `docker-compose.yaml` file. By default: `mongo`.

The connection string by default will then be:

`mongodb://root:root@mongo:27017`

If you don't do this, the app container won't be able to connect to the database.

Also note that the first run might throw a couple of database connections failures until the mongodb service won't be up and running. Don't worry, since Nest will try to connect to the db several times. And the connection will be eventually established.

## Run tests

For simplicity sake only unit tests for the `trip-planner.service` and `trip-manager.service` has been implemented.
These tests mock any external dependency (remote api service, repositories, etc) and will assert the following conditions:

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

## Other potential improvements

For simplicity sake, a set of potential improvements and optimizations haven't been made. Some of these includes:

- a caching layer for caching, like redis. For caching requests combining origin and destination. Reducing remote api calls and improve responses time for frequently requested trips.
- a better authentication and users management systems could have been used. For example an integration with Firebase's authentication system and users management.
- a pagination system for the returned list results of the users's saved trips
- an additional "saved trip detail" endpoint that given a user saved trip id would return the full trip data. Which enables the saved trips schema to save just basic info about the remote api trip to present through a listing endpoint, and return the full saved trip structure only from the "detail" endpoint. Unfortunately I couldn't find a way to query the remote API with just a trip `uid` in return for the full trip object.
- better test coverage both for controllers (unit) and e2e testing
- a health status endpoint could have been implemented for cloud systems health checks
- a more production oriented logger integration with external systems, for centralized logs, monitoring, query etc could have been used
