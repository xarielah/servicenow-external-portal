import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { AwsSecretsService } from './aws-secrets.service';

@Module({
  imports: [CacheModule.register()],
  providers: [AwsSecretsService],
})
export class AwsSecretsModule {}
