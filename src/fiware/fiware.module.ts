import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { KeyrockService } from './keyrock/keyrock.service';
import { KeyrockAuthService } from './keyrock/services/auth.service';
import { KeyrockUserService } from './keyrock/services/user.service';
import { KeyrockRoleService } from './keyrock/services/role.service';
import { KeyrockPermissionService } from './keyrock/services/permission.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
  ],
  controllers: [],
  providers: [
    KeyrockService,
    KeyrockAuthService,
    KeyrockUserService,
    KeyrockRoleService,
    KeyrockPermissionService,
  ],
  exports: [
    KeyrockService,
    KeyrockAuthService,
    KeyrockUserService,
    KeyrockRoleService,
    KeyrockPermissionService,
  ],
})
export class FiwareModule {}
