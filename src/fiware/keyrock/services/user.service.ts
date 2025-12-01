import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto, UpdateUserDto, UserDto } from '../dto/keyrock.dto';

@Injectable()
export class KeyrockUserService {
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

  async createUser(createUserDto: CreateUserDto, token: string): Promise<UserDto> {
    try {
      const userData = {
        user: {
          username: createUserDto.username,
          email: createUserDto.email,
          password: createUserDto.password,
        },
      };

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.keyrockUrl}/v1/users`,
          userData,
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Auth-Token': token,
            },
          },
        ),
      );

      return response.data.user;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.error?.message || 'User creation failed',
          error.response.status,
        );
      }
      throw new HttpException('Keyrock service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async getUser(userId: string, token: string): Promise<UserDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.keyrockUrl}/v1/users/${userId}`,
          {
            headers: {
              'X-Auth-Token': token,
            },
          },
        ),
      );
      return response.data.user;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.error?.message || 'User not found',
          error.response.status,
        );
      }
      throw new HttpException('Keyrock service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async listUsers(token: string): Promise<UserDto[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.keyrockUrl}/v1/users`,
          {
            headers: {
              'X-Auth-Token': token,
            },
          },
        ),
      );
      return response.data.users;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.error?.message || 'Failed to list users',
          error.response.status,
        );
      }
      throw new HttpException('Keyrock service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto, token: string): Promise<UserDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.patch(
          `${this.keyrockUrl}/v1/users/${userId}`,
          { user: updateUserDto },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Auth-Token': token,
            },
          },
        ),
      );
      return response.data.user;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.error?.message || 'Failed to update user',
          error.response.status,
        );
      }
      throw new HttpException('Keyrock service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async deleteUser(userId: string, token: string): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.delete(
          `${this.keyrockUrl}/v1/users/${userId}`,
          {
            headers: {
              'X-Auth-Token': token,
            },
          },
        ),
      );
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.error?.message || 'Failed to delete user',
          error.response.status,
        );
      }
      throw new HttpException('Keyrock service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}
