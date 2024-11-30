import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ENVConfig } from '@core';

import { AppModule } from './app.module';

setTimeout(() => {
  console.log(ENVConfig.dbUrl);
}, 1000);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({ origin: ENVConfig.allowedRestOrigins });

  if (ENVConfig.enableSwagger) {
    const config = new DocumentBuilder()
      .setTitle('BizAway BE Test')
      .addBearerAuth()
      .build();

    SwaggerModule.setup(
      'swagger',
      app,
      SwaggerModule.createDocument(app, config),
    );
  }

  await app
    .listen(ENVConfig.port)
    .then(() => Logger.verbose(`Server running on port: ${ENVConfig.port}`));
}
bootstrap();
