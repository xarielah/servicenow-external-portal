import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import localSecrets from './config/local-secrets';
import { AwsSecretsModule } from './modules/aws-secrets/aws-secrets.module';
import { ServiceNowModule } from './modules/service-now/service-now.module';
import { TemplatesModule } from './modules/templates/templates.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env.production'],
      load: [localSecrets],
    }),
    CacheModule.register(),
    TemplatesModule,
    ServiceNowModule,
    AwsSecretsModule,
    AnnouncementsModule,
  ],
  controllers: [],
})
export class AppModule {}
