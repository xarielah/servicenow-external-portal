import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create the Nest application
  const app = await NestFactory.create(AppModule);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('External Portal API Documentation')
    .setDescription('The External Portal API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // Set global prefix for all routes
  app.setGlobalPrefix('api');

  // Enable versioning for all endpoints, if needed
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      // Enables transformation using class-transformer
      transform: true,

      // Automatically strips unknown properties
      whitelist: true,
    }),
  );

  // Enable CORS
  app.enableCors();

  // Start the server
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
