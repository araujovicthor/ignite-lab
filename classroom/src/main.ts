import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'classroom',
        brokers: process.env.CLOUDKARAFKA_BROKERS.split(','),
        ssl: true,
        sasl: {
          mechanism: 'scram-sha-256', // scram-sha-256 or scram-sha-512
          username: process.env.CLOUDKARAFKA_USERNAME,
          password: process.env.CLOUDKARAFKA_PASSWORD,
        },
      },
    },
  });

  app.startAllMicroservices().then(() => {
    console.log('[Classroom] Microservice running!');
  });

  app.listen(process.env.PORT || 3334).then(() => {
    console.log('[Classroom] HTTP server running!');
  });
}

bootstrap();
