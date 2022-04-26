import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaService
  extends ClientKafka
  implements OnModuleInit, OnModuleDestroy
{
  constructor(configService: ConfigService) {
    super({
      client: {
        clientId: 'purchases',
        brokers: configService.get('CLOUDKARAFKA_BROKERS').split(','),
        // authenticationTimeout: 1000,
        // reauthenticationThreshold: 10000,
        ssl: true,
        sasl: {
          mechanism: 'scram-sha-256', // scram-sha-256 or scram-sha-512
          username: configService.get('CLOUDKARAFKA_USERNAME'),
          password: configService.get('CLOUDKARAFKA_PASSWORD'),
        },
      },
    });
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.close();
  }
}
