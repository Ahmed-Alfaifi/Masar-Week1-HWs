import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ArticleService } from '../article/article.service';
import { UserService } from '../user/user.service';
import { faker } from '@faker-js/faker';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const articleService = app.get(ArticleService);
  const userService = app.get(UserService);

  // First create a test user
  const testUser = await userService.register(
    faker.internet.userName(),
    'password123'
  );

  // Create 20 fake articles
  try {
    for (let i = 0; i < 20; i++) {
      await articleService.create({
        title: faker.lorem.sentence(),
        body: faker.lorem.paragraphs(3)
      }, testUser.id);
      console.log(`Created article ${i + 1}`);
    }
    console.log('Finished creating fake articles');
  } catch (error) {
    console.error('Error creating fake articles:', error);
  } finally {
    await app.close();
  }
}

bootstrap();