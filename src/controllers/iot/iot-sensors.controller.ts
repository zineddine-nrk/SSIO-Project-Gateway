import { Controller, Post, Get, Patch, Delete, Param, HttpCode, HttpStatus, UseGuards, Req, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { IoTSensorManagementService } from '../../services/iot-sensor-management.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

class GetPermanentTokenDto {
  sensorId: string;
  sensorPassword: string;
}

@ApiTags('IoT Sensors (Keyrock Accounts)')
@ApiBearerAuth('JWT-auth')
@Controller('iot/sensors')
@UseGuards(JwtAuthGuard)
export class IoTSensorsController {
  constructor(private readonly iotSensorManagementService: IoTSensorManagementService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create IoT sensor account', 
    description: 'Create a new IoT sensor account in Keyrock. Returns credentials that must be stored on the physical device. The password cannot be retrieved again!' 
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Sensor account created successfully',
    schema: {
      example: {
        sensorId: 'iot_sensor_f1d0ca9e-b519-4a8d-b6ae-1246e443dd7e',
        password: 'iot_sensor_8775b438-6e66-4a6e-87c2-45c6525351ee',
        message: 'IMPORTANT: Save these credentials! The password cannot be retrieved again.'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createIoTSensor(@Req() req: any) {
    return this.iotSensorManagementService.createIoTSensor(req.user.userId);
  }

  @Get()
  @ApiOperation({ 
    summary: 'List all IoT sensor accounts', 
    description: 'Retrieve list of all IoT sensor accounts registered in Keyrock' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Sensor list retrieved',
    schema: {
      example: {
        iots: [
          { id: 'iot_sensor_00000000-0000-0000-0000-000000000000' },
          { id: 'iot_sensor_f1d0ca9e-b519-4a8d-b6ae-1246e443dd7e' }
        ]
      }
    }
  })
  async listIoTSensors(@Req() req: any) {
    return this.iotSensorManagementService.listIoTSensors(req.user.userId);
  }

  @Get(':sensorId')
  @ApiOperation({ 
    summary: 'Get IoT sensor details', 
    description: 'Retrieve details of a specific IoT sensor account' 
  })
  @ApiParam({ name: 'sensorId', description: 'IoT Sensor ID', example: 'iot_sensor_00000000-0000-0000-0000-000000000000' })
  @ApiResponse({ 
    status: 200, 
    description: 'Sensor details retrieved',
    schema: {
      example: {
        id: 'iot_sensor_00000000-0000-0000-0000-000000000000',
        oauth_client_id: 'tutorial-dckr-site-0000-xpresswebapp'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Sensor not found' })
  async getIoTSensor(@Param('sensorId') sensorId: string, @Req() req: any) {
    return this.iotSensorManagementService.getIoTSensor(sensorId, req.user.userId);
  }

  @Patch(':sensorId/reset-password')
  @ApiOperation({ 
    summary: 'Reset IoT sensor password', 
    description: 'Generate a new password for the IoT sensor. The old password is invalidated immediately.' 
  })
  @ApiParam({ name: 'sensorId', description: 'IoT Sensor ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Password reset successfully',
    schema: {
      example: {
        sensorId: 'iot_sensor_00000000-0000-0000-0000-000000000000',
        newPassword: 'iot_sensor_114cb79c-bf69-444a-82a1-e6e85187dacd',
        message: 'IMPORTANT: Update the device with this new password!'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Sensor not found' })
  async resetPassword(@Param('sensorId') sensorId: string, @Req() req: any) {
    return this.iotSensorManagementService.resetIoTSensorPassword(sensorId, req.user.userId);
  }

  @Delete(':sensorId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Delete IoT sensor account', 
    description: 'Remove IoT sensor account from Keyrock. The device will no longer be able to authenticate.' 
  })
  @ApiParam({ name: 'sensorId', description: 'IoT Sensor ID' })
  @ApiResponse({ status: 204, description: 'Sensor deleted successfully' })
  @ApiResponse({ status: 404, description: 'Sensor not found' })
  async deleteIoTSensor(@Param('sensorId') sensorId: string, @Req() req: any) {
    await this.iotSensorManagementService.deleteIoTSensor(sensorId, req.user.userId);
  }

  @Post('permanent-token')
  @ApiOperation({ 
    summary: 'Get permanent token for sensor', 
    description: 'Get a permanent OAuth2 token for an IoT sensor. Used for north port protection (trust tokens in service groups).' 
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        sensorId: { type: 'string', example: 'iot_sensor_00000000-0000-0000-0000-000000000000' },
        sensorPassword: { type: 'string', example: 'iot_sensor_password_here' }
      },
      required: ['sensorId', 'sensorPassword']
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Permanent token generated',
    schema: {
      example: {
        access_token: 'e37aeef5d48c9c1a3d4adf72626a8745918d4355',
        scope: ['permanent']
      }
    }
  })
  async getPermanentToken(@Body() body: GetPermanentTokenDto) {
    return this.iotSensorManagementService.getPermanentToken(body.sensorId, body.sensorPassword);
  }
}
