import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreatePermissionDto, PermissionDto, AssignPermissionToRoleDto } from '../dto/keyrock.dto';

@Injectable()
export class KeyrockPermissionService {
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

  async createPermission(appId: string, createPermDto: CreatePermissionDto, token: string): Promise<PermissionDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.keyrockUrl}/v1/applications/${appId}/permissions`,
          { permission: createPermDto },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Auth-Token': token,
            },
          },
        ),
      );
      return response.data.permission;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.error?.message || 'Failed to create permission',
          error.response.status,
        );
      }
      throw new HttpException('Keyrock service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async getPermission(appId: string, permissionId: string, token: string): Promise<PermissionDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.keyrockUrl}/v1/applications/${appId}/permissions/${permissionId}`,
          {
            headers: {
              'X-Auth-Token': token,
            },
          },
        ),
      );
      return response.data.permission;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.error?.message || 'Permission not found',
          error.response.status,
        );
      }
      throw new HttpException('Keyrock service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async listPermissions(appId: string, token: string): Promise<PermissionDto[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.keyrockUrl}/v1/applications/${appId}/permissions`,
          {
            headers: {
              'X-Auth-Token': token,
            },
          },
        ),
      );
      return response.data.permissions;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.error?.message || 'Failed to list permissions',
          error.response.status,
        );
      }
      throw new HttpException('Keyrock service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async updatePermission(appId: string, permissionId: string, updatePermDto: CreatePermissionDto, token: string): Promise<PermissionDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.patch(
          `${this.keyrockUrl}/v1/applications/${appId}/permissions/${permissionId}`,
          { permission: updatePermDto },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Auth-Token': token,
            },
          },
        ),
      );
      return response.data.permission;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.error?.message || 'Failed to update permission',
          error.response.status,
        );
      }
      throw new HttpException('Keyrock service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async deletePermission(appId: string, permissionId: string, token: string): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.delete(
          `${this.keyrockUrl}/v1/applications/${appId}/permissions/${permissionId}`,
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
          error.response.data.error?.message || 'Failed to delete permission',
          error.response.status,
        );
      }
      throw new HttpException('Keyrock service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async assignPermissionToRole(appId: string, roleId: string, assignDto: AssignPermissionToRoleDto, token: string): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.put(
          `${this.keyrockUrl}/v1/applications/${appId}/roles/${roleId}/permissions/${assignDto.permission_id}`,
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
          error.response.data.error?.message || 'Failed to assign permission to role',
          error.response.status,
        );
      }
      throw new HttpException('Keyrock service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async removePermissionFromRole(appId: string, roleId: string, permissionId: string, token: string): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.delete(
          `${this.keyrockUrl}/v1/applications/${appId}/roles/${roleId}/permissions/${permissionId}`,
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
          error.response.data.error?.message || 'Failed to remove permission from role',
          error.response.status,
        );
      }
      throw new HttpException('Keyrock service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async listRolePermissions(appId: string, roleId: string, token: string): Promise<PermissionDto[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.keyrockUrl}/v1/applications/${appId}/roles/${roleId}/permissions`,
          {
            headers: {
              'X-Auth-Token': token,
            },
          },
        ),
      );
      return response.data.role_permission_assignments;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.error?.message || 'Failed to list role permissions',
          error.response.status,
        );
      }
      throw new HttpException('Keyrock service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}
