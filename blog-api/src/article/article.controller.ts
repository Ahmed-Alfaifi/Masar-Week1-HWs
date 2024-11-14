import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request, ParseIntPipe, ForbiddenException } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { CreateCommentDto } from '../comment/dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.articleService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.articleService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    const article = await this.articleService.findOne(id);
    if (article.authorId !== req.user.userId) {
      throw new ForbiddenException('You can only edit your own articles');
    }
    return this.articleService.update(id, updateArticleDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const article = await this.articleService.findOne(id);
    if (article.authorId !== req.user.userId) {
      throw new ForbiddenException('You can only delete your own articles');
    }
    return this.articleService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  addComment(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.articleService.addComment(id, createCommentDto, req.user.userId);
  }

  @Get(':id/comments')
  getComments(
    @Param('id', ParseIntPipe) id: number,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.articleService.getComments(id, paginationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  likeArticle(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.articleService.likeArticle(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  unlikeArticle(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.articleService.unlikeArticle(id, req.user.userId);
  }
}