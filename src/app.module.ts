import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { seconds, ThrottlerModule } from '@nestjs/throttler';
import { CustomThrottlerGuard } from './common/guards/throttler.guard';
import { FormsModule } from './modules/forms/forms.module';
import { IncidentModule } from './modules/incident/incident.module';
import { ServiceNowModule } from './modules/service-now/service-now.module';
import { TemplatesModule } from './modules/templates/templates.module';

@Module({
  imports: [
    IncidentModule,
    FormsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env.production'],
    }),
    CacheModule.register(),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'default',
          ttl: seconds(7),
          limit: 5,
        },
      ],
    }),
    TemplatesModule,
    ServiceNowModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {}
