import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KeyrockRoleService } from '../fiware/keyrock/services/role.service';
import { KeyrockPermissionService } from '../fiware/keyrock/services/permission.service';

@Injectable()
export class AccessControlService {
  private readonly appId: string;

  constructor(
    private readonly keyrockRoleService: KeyrockRoleService,
    private readonly keyrockPermissionService: KeyrockPermissionService,
    private readonly configService: ConfigService,
  ) {
    this.appId = this.configService.get<string>('KEYROCK_APP_ID') || '';
    if (!this.appId) {
      throw new Error('KEYROCK_APP_ID environment variable is required');
    }
  }

  async createRole(name: string, token: string) {
    return this.keyrockRoleService.createRole(this.appId, { name }, token);
  }

  async getRole(roleId: string, token: string) {
    return this.keyrockRoleService.getRole(this.appId, roleId, token);
  }

  async listRoles(token: string) {
    return this.keyrockRoleService.listRoles(this.appId, token);
  }

  async updateRole(roleId: string, name: string, token: string) {
    return this.keyrockRoleService.updateRole(this.appId, roleId, { name }, token);
  }

  async deleteRole(roleId: string, token: string) {
    return this.keyrockRoleService.deleteRole(this.appId, roleId, token);
  }

  async getRolePermissions(roleId: string, token: string) {
    return this.keyrockPermissionService.listRolePermissions(this.appId, roleId, token);
  }

  async createPermission(
    data: { name: string; action: string; resource: string; description?: string },
    token: string,
  ) {
    return this.keyrockPermissionService.createPermission(
      this.appId,
      {
        name: data.name,
        action: data.action as any,
        resource: data.resource,
        description: data.description,
      },
      token,
    );
  }

  async getPermission(permissionId: string, token: string) {
    return this.keyrockPermissionService.getPermission(this.appId, permissionId, token);
  }

  async listPermissions(token: string) {
    return this.keyrockPermissionService.listPermissions(this.appId, token);
  }

  async updatePermission(
    permissionId: string,
    data: { name: string; action: string; resource: string; description?: string },
    token: string,
  ) {
    return this.keyrockPermissionService.updatePermission(
      this.appId,
      permissionId,
      {
        name: data.name,
        action: data.action as any,
        resource: data.resource,
        description: data.description,
      },
      token,
    );
  }

  async deletePermission(permissionId: string, token: string) {
    return this.keyrockPermissionService.deletePermission(this.appId, permissionId, token);
  }

  async assignPermissionToRole(roleId: string, permissionId: string, token: string) {
    return this.keyrockPermissionService.assignPermissionToRole(
      this.appId,
      roleId,
      { permission_id: permissionId },
      token,
    );
  }

  async removePermissionFromRole(roleId: string, permissionId: string, token: string) {
    return this.keyrockPermissionService.removePermissionFromRole(this.appId, roleId, permissionId, token);
  }
}
