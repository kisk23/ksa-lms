import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto } from './dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new course' })
  create(@Body() dto: CreateCourseDto) {
    // TODO: Extract instructor ID from JWT token
    const instructorId = 'placeholder';
    return this.coursesService.create(instructorId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all courses (paginated)' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.coursesService.findAll({
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      search: query.search,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get course by ID with sections & lessons' })
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a course' })
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.coursesService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a course' })
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
}
