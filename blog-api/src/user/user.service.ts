import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(username: string, password: string): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = this.userRepository.create({
        username,
        password: hashedPassword,
      });
      return await this.userRepository.save(newUser);
    } catch (error) {
      if (error.code === '23505') { // Postgres unique violation code
        throw new ConflictException('Username already exists');
      }
      throw error;
    }
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }
}