import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  Request,
  Response,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { HttpStatusCode } from 'axios';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { AlbumService } from './album.service';
import type { CreateAlbumDto } from './dto/create-album.dto';
import type { UpdateAlbumDto } from './dto/update-album.dto';
import { JwtAuthGuard } from '@core/guards';
import { AlbumEntity } from '@model/album.entity';
import { SwaggerMetaResponse } from '@core/type/global.type';
import { MapResponseSwagger } from '@core/utils/helper';

@ApiTags('Album Api')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @ApiOperation({ summary: 'Create new album' })
  @ApiOkResponse({
    status: 200,
    type: SwaggerMetaResponse,
  })
  @Post()
  async create(@Body() createAlbumDto: CreateAlbumDto, @Response() res) {
    try {
      const data = await this.albumService.create(createAlbumDto);

      return res.status(HttpStatusCode.Created).json(data);
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation({ summary: 'Find album by userId' })
  @MapResponseSwagger(AlbumEntity, { status: 200, isArray: true })
  @Get()
  async findByUserId(@Query('user_id') userId: string, @Response() res) {
    try {
      const data = await this.albumService.findByUserId(userId);

      return res.status(HttpStatusCode.Ok).json(data);
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation({ summary: 'Find myalbum' })
  @MapResponseSwagger(AlbumEntity, { status: 200, isArray: true })
  @Get('/my-album')
  async findMine(@Request() req, @Response() res) {
    try {
      const data = await this.albumService.findByUserId(req.user.id);

      return res.status(HttpStatusCode.Ok).json(data);
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation({ summary: 'Update Album' })
  @ApiOkResponse({
    status: 200,
    type: SwaggerMetaResponse,
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
    @Response() res
  ) {
    try {
      const data = await this.albumService.update(id, updateAlbumDto);

      return res.status(HttpStatusCode.Created).json(data);
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation({ summary: 'Delete Album' })
  @ApiOkResponse({
    status: 200,
    type: SwaggerMetaResponse,
  })
  @Delete(':id')
  async remove(@Param('id') id: string, @Response() res) {
    try {
      const data = await this.albumService.remove(id);

      return res.status(HttpStatusCode.Created).json(data);
    } catch (err) {
      throw err;
    }
  }
}
