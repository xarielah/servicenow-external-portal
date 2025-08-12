import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { AwsSecretsModule } from '../aws-secrets/aws-secrets.module';
import { AwsSecretsService } from '../aws-secrets/aws-secrets.service';
import { ServiceNowService } from './service-now.service';

@Module({
  imports: [CacheModule.register(), AwsSecretsModule],
  providers: [ServiceNowService, AwsSecretsService],
  exports: [ServiceNowService],
})
export class ServiceNowModule {}
