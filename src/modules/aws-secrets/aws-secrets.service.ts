import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class AwsSecretsService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}
  private readonly client = new SecretsManagerClient({
    region: 'eu-central-1',
  });

  async getSecret<T>(secretName: string): Promise<T | Record<string, string>> {
    // Check if the secret is already cached
    const cachedSecret = await this.cacheManager.get<T>(secretName);

    // If secret is cached, return it
    if (cachedSecret) return cachedSecret;

    const command = new GetSecretValueCommand({
      SecretId: secretName,
      VersionStage: 'AWSCURRENT',
    });

    const response = await this.client.send(command);

    const secret = response.SecretString;

    if (!secret) {
      throw new Error('AWS Secrets not found');
    }

    const secrets = JSON.parse(secret);

    // AWS Lambda is up for around 40-50 minutes when started, so we cache for 60 minutes
    // to reduce API calls for AWS Secrets Manager to reduce costs.
    this.cacheManager.set(secretName, secrets, 60 * 60);

    return secrets;
  }
}
