import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { UsersController } from './users/users.controller';
import { RolesController, PermissionsController } from './access-control/access-control.controller';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [ServicesModule],
  controllers: [
    AuthController,
    UsersController,
    RolesController,
    PermissionsController,
  ],
})
export class ControllersModule {}
