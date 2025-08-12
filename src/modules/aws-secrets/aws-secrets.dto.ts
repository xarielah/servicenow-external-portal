import { Expose } from 'class-transformer';

export class AwsSecretsDto {
  @Expose({ name: 'SERVICENOW_APP_URL' })
  INSTANCE: string;

  @Expose({ name: 'SERVICENOW_APP_USER' })
  APP_USER: string;

  @Expose({ name: 'SERVICENOW_APP_PASSWORD' })
  APP_PASSWORD: string;

  @Expose({ name: 'SERVICENOW_APP_CLIENT_SECRET' })
  APP_CLIENT_SECRET: string;

  @Expose({ name: 'SERVICENOW_APP_CLIENT_ID' })
  APP_CLIENT_ID: string;
}
