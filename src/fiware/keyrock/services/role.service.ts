import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateRoleDto, RoleDto, AssignRoleToUserDto } from '../dto/keyrock.dto';
import { log } from 'console';

@Injectable()
export class KeyrockRoleService {
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

  async createRole(appId: string, createRoleDto: CreateRoleDto, token: string): Promise<RoleDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.keyrockUrl}/v1/applications/${appId}/roles`,
          { role: createRoleDto },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Auth-Token': token,
            },
          },
        ),
      );
      return response.data.role;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.error?.message || 'Failed to create role',
          error.response.status,
        );
      }
      throw new HttpException('Keyrock service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async getRole(appId: string, roleId: string, token: string): Promise<RoleDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.keyrockUrl}/v1/applications/${appId}/roles/${roleId}`,
          {
            headers: {
              'X-Auth-Token': token,
            },
          },
        ),
      );
      return response.data.role;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.error?.message || 'Role not found',
          error.response.status,
        );
      }
      throw new HttpException('Keyrock service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async listRoles(appId: string, token: string): Promise<RoleDto[]> {
    try {      
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.keyrockUrl}/v1/applications/${appId}/roles`,
          {
            headers: {
              'X-Auth-Token': token,
            },
          },
        ),
      );
      return response.data.roles;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.error?.message || 'Failed to list roles',
          error.response.status,
        );
      }
      throw new HttpException('Keyrock service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async updateRole(appId: string, roleId: string, updateRoleDto: CreateRoleDto, token: string): Promise<RoleDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.patch(
          `${this.keyrockUrl}/v1/applications/${appId}/roles/${roleId}`,
          { role: updateRoleDto },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Auth-Token': token,
            },
          },
        ),
      );
      return response.data.role;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.error?.message || 'Failed to update role',
          error.response.status,
        );
      }
      throw new HttpException('Keyrock service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async deleteRole(appId: string, roleId: string, token: string): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.delete(
          `${this.keyrockUrl}/v1/applications/${appId}/roles/${roleId}`,
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
          error.response.data.error?.message || 'Failed to delete role',
          error.response.status,
        );
      }
      throw new HttpException('Keyrock service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async assignRoleToUser(appId: string, assignDto: AssignRoleToUserDto, token: string): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.put(
          `${this.keyrockUrl}/v1/applications/${appId}/users/${assignDto.user_id}/roles/${assignDto.role_id}`,
          {},
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
          error.response.data.error?.message || 'Failed to assign role to user',
          error.response.status,
        );
      }
      throw new HttpException('Keyrock service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async removeRoleFromUser(appId: string, userId: string, roleId: string, token: string): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.delete(
          `${this.keyrockUrl}/v1/applications/${appId}/users/${userId}/roles/${roleId}`,
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
          error.response.data.error?.message || 'Failed to remove role from user',
          error.response.status,
        );
      }
      throw new HttpException('Keyrock service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async listUserRoles(appId: string, userId: string, token: string): Promise<RoleDto[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.keyrockUrl}/v1/applications/${appId}/users/${userId}/roles`,
          {
            headers: {
              'X-Auth-Token': token,
            },
          },
        ),
      );
      return response.data.role_user_assignments;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.error?.message || 'Failed to list user roles',
          error.response.status,
        );
      }
      throw new HttpException('Keyrock service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}
