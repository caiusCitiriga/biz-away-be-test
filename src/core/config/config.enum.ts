export enum ENVConfigs {
  dbUrl = 'BZA_DB_URL',
  dbName = 'BZA_DB_NAME',
  JWTSecret = 'BZA_JWT_SECRET',

  testUsername = 'BZA_TEST_USERNAME',
  testPassword = 'BZA_TEST_PASSWORD',

  port = 'BZA_GATEWAY_PORT',
  enableSwagger = 'BZA_ENABLE_SWAGGER',
  createOpenApiSpec = 'BZA_CREATE_OPEN_API_SPEC',
  allowedRestOrigins = 'BZA_GATEWAY_ALLOWED_REST_ORIGINS',
  acceptUnknownOrigins = 'BZA_GATEWAY_ACCEPT_UNKNOWN_ORIGINS',
}
