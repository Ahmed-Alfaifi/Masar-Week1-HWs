import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Article } from './entities/article.entity';
import { Comment } from '../comment/entities/comment.entity';
import { User } from '../user/entities/user.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { CreateCommentDto } from '../comment/dto/create-comment.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createArticleDto: CreateArticleDto, userId: number): Promise<Article> {
    const article = this.articleRepository.create({
      ...createArticleDto,
      authorId: userId,
    });
    return this.articleRepository.save(article);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search } = paginationDto;
    const skip = (page - 1) * limit;

    const whereClause = search
      ? [
          { title: Like(`%${search}%`) },
          { body: Like(`%${search}%`) },
        ]
      : {};

    const [articles, total] = await this.articleRepository.findAndCount({
      where: whereClause,
      take: limit,
      skip,
      order: { createdAt: 'DESC' },
      relations: ['author', 'likes'],
    });

    return {
      data: articles,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: ['author', 'likes'],
    });
    if (!article) {
      throw new NotFoundException(`Article with ID "${id}" not found`);
    }
    return article;
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    const article = await this.findOne(id);
    Object.assign(article, updateArticleDto);
    return this.articleRepository.save(article);
  }

  async remove(id: number) {
    const article = await this.findOne(id);
    return this.articleRepository.remove(article);
  }

  async addComment(articleId: number, createCommentDto: CreateCommentDto, userId: number) {
    const article = await this.findOne(articleId);
    const comment = this.commentRepository.create({
      ...createCommentDto,
      articleId,
      authorId: userId,
    });
    return this.commentRepository.save(comment);
  }

  async getComments(articleId: number, paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search } = paginationDto;
    const skip = (page - 1) * limit;

    const whereClause: any = { articleId };
    if (search) {
      whereClause.content = Like(`%${search}%`);
    }

    const [comments, total] = await this.commentRepository.findAndCount({
      where: whereClause,
      take: limit,
      skip,
      order: { createdAt: 'DESC' },
      relations: ['author'],
    });

    return {
      data: comments,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async likeArticle(articleId: number, userId: number) {
    const article = await this.findOne(articleId);
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['likedArticles'],
    });

    if (!user.likedArticles.some(a => a.id === articleId)) {
      user.likedArticles.push(article);
      await this.userRepository.save(user);
    }

    return this.findOne(articleId);
  }

  async unlikeArticle(articleId: number, userId: number) {
    const article = await this.findOne(articleId);
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['likedArticles'],
    });

    user.likedArticles = user.likedArticles.filter(a => a.id !== articleId);
    await this.userRepository.save(user);

    return this.findOne(articleId);
  }
}