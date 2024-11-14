import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ArticleService } from '../article/article.service';
import { faker } from '@faker-js/faker';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const articleService = app.get(ArticleService);

  // Loop to create 1000 articles
  for (let i = 0; i < 1000; i++) {
    const title = faker.lorem.sentence();
    const body = faker.lorem.paragraphs(3);

    // Call the method to create an article
    await articleService.create({
      title,
      body,
    });
  }

  console.log('1000 articles generated!');
  await app.close();
}

bootstrap();
