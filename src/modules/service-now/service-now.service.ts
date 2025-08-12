import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { plainToInstance } from 'class-transformer';
import { AwsSecretsDto } from '../aws-secrets/aws-secrets.dto';
import { AwsSecrets } from '../aws-secrets/aws-secrets.interface';
import { AwsSecretsService } from '../aws-secrets/aws-secrets.service';

@Injectable()
export class ServiceNowService {
  constructor(
    @Inject() private readonly configService: ConfigService,
    @Inject() private readonly awsSecretsService: AwsSecretsService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}
  private readonly TOKEN_KEY = 'token';
  private readonly SECRET_NAME = 'servicenow';

  private async _getSecrets(): Promise<AwsSecretsDto> {
    if (process.env.NODE_ENV !== 'production' || process.env.ENV === 'render') {
      const localSecrets = this.configService.getOrThrow('secrets');
      return localSecrets;
    }

    const secrets = this.awsSecretsService.getSecret<AwsSecrets>(
      this.SECRET_NAME,
    );

    const transformedSecrets = plainToInstance(AwsSecretsDto, secrets, {
      excludeExtraneousValues: true,
    });

    return transformedSecrets;
  }

  private async _getRefreshPayload() {
    const secrets = await this._getSecrets();

    const paramsPayload = {
      grant_type: 'password',
      client_id: secrets.APP_CLIENT_ID,
      client_secret: secrets.APP_CLIENT_SECRET,
      username: secrets.APP_USER,
      password: secrets.APP_PASSWORD,
    };

    return new URLSearchParams(paramsPayload).toString();
  }

  private async _refreshToken() {
    const secrets = await this._getSecrets();
    const baseUrl = secrets.INSTANCE;

    const res = await fetch(`${baseUrl}/oauth_token.do`, {
      method: 'POST',
      body: await this._getRefreshPayload(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
    });

    const json = await res.json();

    if (json.access_token) {
      this.cacheManager.set(
        this.TOKEN_KEY,
        json.access_token,
        1800 /* ServiceNow token defaultly expires in 1800 seconds */,
      );
    }
  }

  private async _getToken() {
    return this.cacheManager.get(this.TOKEN_KEY);
  }

  private async _getHeaders(headers?: HeadersInit) {
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${await this._getToken()}`,
      ...headers,
    };
  }

  async fetch(url: string | URL | Request, options?: RequestInit) {
    const secrets = await this._getSecrets();
    const baseUrl = secrets.INSTANCE;

    const requestUrl = `${baseUrl + url}`;
    const headers = await this._getHeaders(options?.headers);

    const res = await fetch(requestUrl, {
      ...options,
      headers,
    });

    // If the token is expired, refresh it and retry the request.
    if (res.status === 401) {
      await this._refreshToken();
      const updatedHeaders = await this._getHeaders(options?.headers);
      return fetch(requestUrl, {
        ...options,
        headers: updatedHeaders,
      });
    }

    return res;
  }
}
