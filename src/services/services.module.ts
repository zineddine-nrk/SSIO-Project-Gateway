import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserManagementService } from './user-management.service';
import { AccessControlService } from './access-control.service';
import { FiwareModule } from '../fiware/fiware.module';

@Module({
  imports: [FiwareModule],
  providers: [
    AuthService,
    UserManagementService,
    AccessControlService,
  ],
  exports: [
    AuthService,
    UserManagementService,
    AccessControlService,
  ],
})
export class ServicesModule {}
