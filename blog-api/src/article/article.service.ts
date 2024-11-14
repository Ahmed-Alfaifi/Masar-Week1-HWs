import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  create(createArticleDto: CreateArticleDto): Promise<Article> {
    const article = this.articleRepository.create(createArticleDto);
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
      order: { id: 'DESC' },
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
    const article = await this.articleRepository.findOne({ where: { id } });
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
}