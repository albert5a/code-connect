import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../common/decorators/user.decorator';
import type { JwtValidated } from '../auth/strategies';
import { JwtAuthGuard, OptionalJwtAuthGuard } from '../auth/guards';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  findAll(
    @Query('search') search: string | undefined,
    @GetUser() user: JwtValidated | null,
  ) {
    return this.postsService.findAll(search, user?.id);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: JwtValidated | null) {
    return this.postsService.findOne(id, user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPostDto: CreatePostDto, @GetUser() user: JwtValidated) {
    return this.postsService.create(createPostDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/likes')
  like(@Param('id') id: string, @GetUser() user: JwtValidated) {
    return this.postsService.like(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/likes')
  unlike(@Param('id') id: string, @GetUser() user: JwtValidated) {
    return this.postsService.unlike(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  comment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
    @GetUser() user: JwtValidated,
  ) {
    return this.postsService.comment(id, user.id, createCommentDto);
  }
}
