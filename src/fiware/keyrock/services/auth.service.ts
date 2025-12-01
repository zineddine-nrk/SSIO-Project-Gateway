import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { LoginDto, LoginResponseDto, TokenInfoDto, TokenInfoResponseDto } from '../dto/keyrock.dto';

@Injectable()
export class KeyrockAuthService {
  private readonly keyrockUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    const keyrockUrl = this.configService.get<string>('KEYROCK_URL');
    if (!keyrockUrl) {
      throw new Error('KEYROCK_URL must be defined');
    }
    this.keyrockUrl = keyrockUrl;
  }

  async getToken(loginDto: LoginDto): Promise<LoginResponseDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.keyrockUrl}/v1/auth/tokens`,
          {
            name: loginDto.email,
            password: loginDto.password,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      const accessToken = response.headers?.['x-subject-token'];
      if (!accessToken) {
        throw new HttpException('Missing access token in Keyrock response', HttpStatus.UNAUTHORIZED);
      }

      const expiresAt = response.data?.token?.expires_at;
      const expiresIn =
        expiresAt && !isNaN(Date.parse(expiresAt))
          ? Math.max(0, Math.floor((Date.parse(expiresAt) - Date.now()) / 1000))
          : 0;

      return {
        access_token: accessToken,
        expires_in: expiresIn,
      } as LoginResponseDto;
    } catch (error) {
      console.error('Keyrock Login Error:', error.response?.data || error.message);
      if (error.response) {
        const errorMessage = error || 'Login failed';
        throw new HttpException(errorMessage, error.response.status);
      }
      throw new HttpException('Keyrock service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async getTokenInfo(tokenInfoDto: TokenInfoDto): Promise<TokenInfoResponseDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.keyrockUrl}/v1/auth/tokens`,
          {
            headers: {
              'X-Auth-token': tokenInfoDto.X_Auth_token,
              'X-Subject-token': tokenInfoDto.X_Subject_token,
            },
          },
        ),
      );
     console.log(response);
     
      const tokenData = response.data;

      return {
        access_token: tokenInfoDto.X_Subject_token,
        expires: tokenData.expires,
        valid: true,
        User: {
          id: tokenData.User.id,
          username: tokenData.User.username,
          email: tokenData.User.email,
          date_password: tokenData.User.date_password,
          enabled: tokenData.User.enabled,
          admin: tokenData.User.admin || false,
        },
      };
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return {
          access_token: tokenInfoDto.X_Subject_token,
          expires: '',
          valid: false,
          User: null,
        };
      }

      throw new HttpException(
        'Failed to validate token',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
