import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Put,
  Request,
  UseGuards,
  Query,
  Response,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { HttpStatusCode } from 'axios';

import type { UserService } from './user.service';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '@core/guards';
import type { GetManyUserDto } from './dto/get-user.dto';
import { MapResponseSwagger } from '@/@core/utils/helper';
import { UserEntity } from '@model/user.entity';
import { SwaggerMetaResponse } from '@/@core/type/global.type';

@ApiTags('User Api')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create new user' })
  @ApiOkResponse({
    status: 200,
    type: SwaggerMetaResponse,
  })
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Response() res) {
    try {
      const data = await this.userService.create(createUserDto);

      return res.status(HttpStatusCode.Created).json({
        status_code: HttpStatusCode.Created,
        status_description: data,
      });
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation({ summary: 'Find many user' })
  @MapResponseSwagger(UserEntity, { status: 200, isArray: true })
  @Get()
  async findAll(
    @Request() req,
    @Query() query: GetManyUserDto,
    @Response() res
  ) {
    try {
      const data = await this.userService.findAll(query, req.user);

      return res.status(HttpStatusCode.Created).json(data);
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation({ summary: 'Get user profile' })
  @MapResponseSwagger(UserEntity, { status: 200, isArray: false })
  @Get('/profile')
  async findOne(@Request() req, @Response() res) {
    try {
      const data = await this.userService.findOne(req.user);

      return res.status(HttpStatusCode.Created).json(data);
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation({ summary: 'Edit user data' })
  @ApiOkResponse({
    status: 200,
    type: SwaggerMetaResponse,
  })
  @Put()
  async update(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
    @Response() res
  ) {
    try {
      const data = await this.userService.update(req.user.id, updateUserDto);

      return res.status(HttpStatusCode.Created).json({
        status_code: HttpStatusCode.Created,
        status_description: data,
      });
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation({ summary: 'Delete account' })
  @ApiOkResponse({
    status: 200,
    type: SwaggerMetaResponse,
  })
  @Delete()
  async remove(@Request() req, @Response() res) {
    try {
      const data = await this.userService.remove(req.user.id);

      return res.status(HttpStatusCode.Created).json({
        status_code: HttpStatusCode.Created,
        status_description: data,
      });
    } catch (err) {
      throw err;
    }
  }
}