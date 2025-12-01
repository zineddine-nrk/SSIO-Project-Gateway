import { Controller, Post, Get, Put, Delete, Body, Param, HttpCode, HttpStatus, Headers, Query } from '@nestjs/common';
import { UserManagementService } from '../../services/user-management.service';
import { CreateUserDto, UpdateUserDto } from '../../fiware/keyrock/dto/keyrock.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userManagementService: UserManagementService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto, @Headers('authorization') auth: string) {
    const token = auth?.replace('Bearer ', '');
    return this.userManagementService.createUser(createUserDto, token);
  }

  @Get(':id')
  async getUser(@Param('id') id: string, @Headers('authorization') auth: string) {
    const token = auth?.replace('Bearer ', '');
    return this.userManagementService.getUser(id, token);
  }

  @Get()
  async listUsers(@Headers('authorization') auth: string) {
    const token = auth?.replace('Bearer ', '');
    return this.userManagementService.listUsers(token);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Headers('authorization') auth: string,
  ) {
    const token = auth?.replace('Bearer ', '');
    return this.userManagementService.updateUser(id, updateUserDto, token);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string, @Headers('authorization') auth: string) {
    const token = auth?.replace('Bearer ', '');
    await this.userManagementService.deleteUser(id, token);
  }

  @Get(':id/roles')
  async getUserRoles(
    @Param('id') userId: string,
    @Headers('authorization') auth: string,
  ) {
    const token = auth?.replace('Bearer ', '');
    return this.userManagementService.getUserRoles(userId, token);
  }

  @Post(':id/roles')
  async assignRole(
    @Param('id') userId: string,
    @Body() body: { roleId: string },
    @Headers('authorization') auth: string,
  ) {
    const token = auth?.replace('Bearer ', '');
    await this.userManagementService.assignRoleToUser(userId, body.roleId, token);
    return { message: 'Role assigned successfully' };
  }

  @Delete(':id/roles/:roleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeRole(
    @Param('id') userId: string,
    @Param('roleId') roleId: string,
    @Headers('authorization') auth: string,
  ) {
    const token = auth?.replace('Bearer ', '');
    await this.userManagementService.removeRoleFromUser(userId, roleId, token);
  }
}
