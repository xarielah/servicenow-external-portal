import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ServiceNowService } from './service-now.service';

@Module({
  imports: [CacheModule.register()],
  providers: [ServiceNowService],
  exports: [ServiceNowService],
})
export class ServiceNowModule {}
