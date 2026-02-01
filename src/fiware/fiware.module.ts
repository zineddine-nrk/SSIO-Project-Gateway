import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { KeyrockService } from './keyrock/keyrock.service';
import { KeyrockAuthService } from './keyrock/services/auth.service';
import { KeyrockUserService } from './keyrock/services/user.service';
import { KeyrockRoleService } from './keyrock/services/role.service';
import { KeyrockPermissionService } from './keyrock/services/permission.service';
import { KeyrockIoTSensorService } from './keyrock/services/iot-sensor.service';
import { IoTAgentService } from './iot-agent/iot-agent.service';
import { PepProxyService } from './pep-proxy/pep-proxy.service';
import { SessionModule } from '../services/session.module';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    SessionModule,
  ],
  controllers: [],
  providers: [
    KeyrockService,
    KeyrockAuthService,
    KeyrockUserService,
    KeyrockRoleService,
    KeyrockPermissionService,
    KeyrockIoTSensorService,
    IoTAgentService,
    PepProxyService,
  ],
  exports: [
    KeyrockService,
    KeyrockAuthService,
    KeyrockUserService,
    KeyrockRoleService,
    KeyrockPermissionService,
    KeyrockIoTSensorService,
    IoTAgentService,
    PepProxyService,
  ],
})
export class FiwareModule {}
