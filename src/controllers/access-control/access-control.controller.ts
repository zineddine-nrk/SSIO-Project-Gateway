import { Controller, Post, Get, Put, Delete, Body, Param, HttpCode, HttpStatus, Headers, Query } from '@nestjs/common';
import { AccessControlService } from '../../services/access-control.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly accessControlService: AccessControlService) {}

  @Post()
  async createRole(
    @Body() body: { name: string },
    @Headers('authorization') auth: string,
  ) {
    const token = auth?.replace('Bearer ', '');
    return this.accessControlService.createRole(body.name, token);
  }

  @Get()
  async listRoles(@Headers('authorization') auth: string) {
    const token = auth?.replace('Bearer ', '');
    return this.accessControlService.listRoles(token);
  }

  @Get(':id')
  async getRole(
    @Param('id') roleId: string,
    @Headers('authorization') auth: string,
  ) {
    const token = auth?.replace('Bearer ', '');
    return this.accessControlService.getRole(roleId, token);
  }

  @Put(':id')
  async updateRole(
    @Param('id') roleId: string,
    @Body() body: { name: string },
    @Headers('authorization') auth: string,
  ) {
    const token = auth?.replace('Bearer ', '');
    return this.accessControlService.updateRole(roleId, body.name, token);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRole(
    @Param('id') roleId: string,
    @Headers('authorization') auth: string,
  ) {
    const token = auth?.replace('Bearer ', '');
    await this.accessControlService.deleteRole(roleId, token);
  }

  @Get(':id/permissions')
  async getRolePermissions(
    @Param('id') roleId: string,
    @Headers('authorization') auth: string,
  ) {
    const token = auth?.replace('Bearer ', '');
    return this.accessControlService.getRolePermissions(roleId, token);
  }

  @Post(':id/permissions')
  async assignPermission(
    @Param('id') roleId: string,
    @Body() body: { permissionId: string },
    @Headers('authorization') auth: string,
  ) {
    const token = auth?.replace('Bearer ', '');
    await this.accessControlService.assignPermissionToRole(roleId, body.permissionId, token);
    return { message: 'Permission assigned successfully' };
  }

  @Delete(':id/permissions/:permissionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removePermission(
    @Param('id') roleId: string,
    @Param('permissionId') permissionId: string,
    @Headers('authorization') auth: string,
  ) {
    const token = auth?.replace('Bearer ', '');
    await this.accessControlService.removePermissionFromRole(roleId, permissionId, token);
  }
}

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly accessControlService: AccessControlService) {}

  @Post()
  async createPermission(
    @Body() body: { name: string; action: string; resource: string; description?: string },
    @Headers('authorization') auth: string,
  ) {
    const token = auth?.replace('Bearer ', '');
    return this.accessControlService.createPermission(
      {
        name: body.name,
        action: body.action,
        resource: body.resource,
        description: body.description,
      },
      token,
    );
  }

  @Get()
  async listPermissions(@Headers('authorization') auth: string) {
    const token = auth?.replace('Bearer ', '');
    return this.accessControlService.listPermissions(token);
  }

  @Get(':id')
  async getPermission(
    @Param('id') permissionId: string,
    @Headers('authorization') auth: string,
  ) {
    const token = auth?.replace('Bearer ', '');
    return this.accessControlService.getPermission(permissionId, token);
  }

  @Put(':id')
  async updatePermission(
    @Param('id') permissionId: string,
    @Body() body: { name: string; action: string; resource: string; description?: string },
    @Headers('authorization') auth: string,
  ) {
    const token = auth?.replace('Bearer ', '');
    return this.accessControlService.updatePermission(
      permissionId,
      {
        name: body.name,
        action: body.action,
        resource: body.resource,
        description: body.description,
      },
      token,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePermission(
    @Param('id') permissionId: string,
    @Headers('authorization') auth: string,
  ) {
    const token = auth?.replace('Bearer ', '');
    await this.accessControlService.deletePermission(permissionId, token);
  }
}
