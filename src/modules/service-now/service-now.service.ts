import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import {
  APP_CLIENT_ID,
  APP_CLIENT_SECRET,
  APP_PASS,
  APP_USER,
  INSTANCE_URL,
} from 'src/common/env-keys';

@Injectable()
export class ServiceNowService {
  constructor(
    @Inject() private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  private readonly TOKEN_KEY = 'token';

  private _getRefreshPayload() {
    const paramsPayload = {
      grant_type: 'password',
      client_id: this.configService.get<string>(APP_CLIENT_ID)!,
      client_secret: this.configService.get<string>(APP_CLIENT_SECRET)!,
      username: this.configService.get<string>(APP_USER)!,
      password: this.configService.get<string>(APP_PASS)!,
    };

    return new URLSearchParams(paramsPayload).toString();
  }

  private async _refreshToken() {
    const baseUrl = this.configService.get<string>(INSTANCE_URL);
    const res = await fetch(`${baseUrl}/oauth_token.do`, {
      method: 'POST',
      body: this._getRefreshPayload(),
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
    const baseUrl = this.configService.get<string>(INSTANCE_URL)!;
    const requestUrl = `${baseUrl + url}`;
    const headers = await this._getHeaders(options?.headers);

    const res = await fetch(requestUrl, {
      ...options,
      headers,
    });

    // If the token is expired, refresh it
    // and retry the request.
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
