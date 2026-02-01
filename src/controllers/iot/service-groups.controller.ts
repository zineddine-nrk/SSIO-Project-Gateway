import { Controller, Post, Get, Delete, Body, Query, UseGuards, Put, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { IoTService } from '../../services/iot.service';
import { CreateServiceGroupDto } from '../../fiware/iot-agent/dto';
import { DeleteServiceGroupQueryDto } from './dto/delete-service-group-query.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@ApiTags('IoT Service Groups')
@ApiBearerAuth('JWT-auth')
@Controller('iot/groups')
@UseGuards(JwtAuthGuard)
export class ServiceGroupsController {
  constructor(private readonly iotService: IoTService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create service group', 
    description: 'Provision a new service group in IoT Agent for device communication' 
  })
  @ApiResponse({ status: 201, description: 'Service group created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Validation failed' })
  async createServiceGroup(@Body() createServiceGroupDto: CreateServiceGroupDto) {
    return this.iotService.createServiceGroup(createServiceGroupDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all service groups', 
    description: 'Retrieve list of all provisioned service groups' 
  })
  @ApiResponse({ status: 200, description: 'Service groups list retrieved' })
  async getServiceGroups() {
    return this.iotService.getServiceGroups();
  }

  @Put()
  @ApiOperation({ 
    summary: 'Update service group', 
    description: 'Update a service group configuration. Use this to add trust tokens for north port protection.' 
  })
  @ApiQuery({ name: 'resource', required: true, description: 'Resource path (e.g., /iot/d)' })
  @ApiQuery({ name: 'apikey', required: true, description: 'API key of the service group' })
  @ApiBody({ 
    description: 'Service group update data',
    schema: {
      type: 'object',
      properties: {
        cbroker: { type: 'string', example: 'http://orion-proxy:1027', description: 'Context broker URL (use PEP proxy URL for protection)' },
        trust: { type: 'string', example: 'e37aeef5d48c9c1a3d4adf72626a8745918d4355', description: 'Permanent OAuth2 token for north port authentication' },
        entity_type: { type: 'string', example: 'TemperatureSensor' },
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Service group updated successfully' })
  @ApiResponse({ status: 404, description: 'Service group not found' })
  async updateServiceGroup(
    @Query('resource') resource: string,
    @Query('apikey') apikey: string,
    @Body() body: any,
  ) {
    return this.iotService.updateServiceGroup(body, { resource, apikey });
  }

  @Delete()
  @ApiOperation({ 
    summary: 'Delete service group', 
    description: 'Delete a service group by resource or apikey' 
  })
  @ApiQuery({ name: 'resource', required: false, description: 'Resource path' })
  @ApiQuery({ name: 'apikey', required: false, description: 'API key' })
  @ApiResponse({ status: 200, description: 'Service group deleted successfully' })
  @ApiResponse({ status: 404, description: 'Service group not found' })
  async deleteServiceGroup(@Query() queryParams: DeleteServiceGroupQueryDto) {
    return this.iotService.deleteServiceGroup(queryParams);
  }
}
