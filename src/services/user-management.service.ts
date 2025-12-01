import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KeyrockUserService } from '../fiware/keyrock/services/user.service';
import { KeyrockRoleService } from '../fiware/keyrock/services/role.service';
import { CreateUserDto, UpdateUserDto } from '../fiware/keyrock/dto/keyrock.dto';

@Injectable()
export class UserManagementService {
  private readonly appId: string;

  constructor(
    private readonly keyrockUserService: KeyrockUserService,
    private readonly keyrockRoleService: KeyrockRoleService,
    private readonly configService: ConfigService,
  ) {
    this.appId = this.configService.get<string>('KEYROCK_APP_ID') || '';
    if (!this.appId) {
      throw new Error('KEYROCK_APP_ID environment variable is required');
    }
  }

  async createUser(data: CreateUserDto, token: string) {
    return this.keyrockUserService.createUser(data, token);
  }

  async getUser(userId: string, token: string) {
    return this.keyrockUserService.getUser(userId, token);
  }

  async listUsers(token: string) {
    return this.keyrockUserService.listUsers(token);
  }

  async updateUser(userId: string, data: UpdateUserDto, token: string) {
    return this.keyrockUserService.updateUser(userId, data, token);
  }

  async deleteUser(userId: string, token: string) {
    return this.keyrockUserService.deleteUser(userId, token);
  }

  async getUserRoles(userId: string, token: string) {
    return this.keyrockRoleService.listUserRoles(this.appId, userId, token);
  }

  async assignRoleToUser(userId: string, roleId: string, token: string) {
    return this.keyrockRoleService.assignRoleToUser(
      this.appId,
      { user_id: userId, role_id: roleId },
      token,
    );
  }

  async removeRoleFromUser(userId: string, roleId: string, token: string) {
    return this.keyrockRoleService.removeRoleFromUser(this.appId, userId, roleId, token);
  }
}
