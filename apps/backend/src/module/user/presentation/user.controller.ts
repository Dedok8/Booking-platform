import {
  CreateUserDto,
  UpdateUserDto,
  UpdateUserRoleDto,
  UserQueryDto,
} from '@/module/user/application/dto/user.dto.js';
import { toUserDto } from '@/module/user/application/mapper/user.mapper.js';
import { UserService } from '@/module/user/application/user.service.js';
import { Roles } from '@/shared/decorators/roles.decorator.js';
import { USER_ROLE } from '@booking-platform/shared';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

@Roles(USER_ROLE.ADMIN)
@Controller('users')
export class UserController {
  constructor(private readonly users: UserService) {}

  @Get()
  async list(@Query() query: UserQueryDto) {
    const { items, ...meta } = await this.users.findAll(query);
    return { items: items.map(toUserDto), ...meta };
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    return toUserDto(await this.users.findById(id));
  }

  @Post()
  async create(@Body() body: CreateUserDto) {
    return toUserDto(await this.users.create(body));
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateUserDto,
  ) {
    return toUserDto(await this.users.update(id, body));
  }

  @Patch(':id/role')
  async changeRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateUserRoleDto,
  ) {
    return toUserDto(await this.users.updateRole(id, body));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.users.delete(id);
  }
}
