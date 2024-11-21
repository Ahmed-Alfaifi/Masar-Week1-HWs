import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Article } from '../article/entities/article.entity';
import { ProfileResponseDto, FollowUserResponseDto } from './dto/profile.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Article)
        private readonly articleRepository: Repository<Article>,
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
            if (error.code === '23505') {
                throw new ConflictException('Username already exists');
            }
            throw new InternalServerErrorException('Error creating user');
        }
    }

    async findByUsername(username: string): Promise<User | undefined> {
        try {
            return await this.userRepository.findOne({ 
                where: { username },
                select: ['id', 'username', 'password', 'createdAt'] 
            });
        } catch (error) {
            throw new InternalServerErrorException('Error finding user');
        }
    }

    async validateUser(username: string, password: string): Promise<User | null> {
        try {
            const user = await this.findByUsername(username);
            if (user && (await bcrypt.compare(password, user.password))) {
                return user;
            }
            return null;
        } catch (error) {
            throw new InternalServerErrorException('Error validating user');
        }
    }

    async getProfile(userId: number, currentUserId?: number): Promise<ProfileResponseDto> {
        try {
            console.log('Finding user with ID:', userId);
            
            // First get user without relations
            const user = await this.userRepository.findOne({
                where: { id: userId }
            });

            console.log('User found:', user);

            if (!user) {
                throw new NotFoundException('User not found');
            }

            // Get counts using queryBuilder
            const followersCount = await this.userRepository
                .createQueryBuilder()
                .select()
                .from('users_follows_users', 'f')
                .where('f.userId_2 = :userId', { userId })
                .getCount();

            const followingCount = await this.userRepository
                .createQueryBuilder()
                .select()
                .from('users_follows_users', 'f')
                .where('f.userId_1 = :userId', { userId })
                .getCount();

            const articlesCount = await this.articleRepository
                .createQueryBuilder('article')
                .where('article.authorId = :userId', { userId })
                .getCount();

            let isFollowing = undefined;
            if (currentUserId) {
                const followRelation = await this.userRepository
                    .createQueryBuilder()
                    .select()
                    .from('users_follows_users', 'f')
                    .where('f.userId_1 = :currentUserId AND f.userId_2 = :userId', 
                        { currentUserId, userId })
                    .getOne();
                isFollowing = !!followRelation;
            }

            const response = {
                id: user.id,
                username: user.username,
                followersCount,
                followingCount,
                articlesCount,
                isFollowing,
                createdAt: user.createdAt
            };

            console.log('Response object:', response);
            return response;
        } catch (error) {
            console.error('Error in getProfile:', error);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(
                'Error getting user profile: ' + (error.message || error)
            );
        }
    }

    async followUser(followerId: number, followingId: number): Promise<void> {
        try {
            if (followerId === followingId) {
                throw new ConflictException('Users cannot follow themselves');
            }

            // Check if both users exist
            const [follower, following] = await Promise.all([
                this.userRepository.findOne({ where: { id: followerId } }),
                this.userRepository.findOne({ where: { id: followingId } })
            ]);

            if (!follower || !following) {
                throw new NotFoundException('User not found');
            }

            // Check if already following
            const existingFollow = await this.userRepository
                .createQueryBuilder()
                .select()
                .from('users_follows_users', 'f')
                .where('f.userId_1 = :followerId AND f.userId_2 = :followingId', 
                    { followerId, followingId })
                .getOne();

            if (existingFollow) {
                throw new ConflictException('Already following this user');
            }

            // Create follow relationship
            await this.userRepository
                .createQueryBuilder()
                .insert()
                .into('users_follows_users')
                .values({ userId_1: followerId, userId_2: followingId })
                .execute();

        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ConflictException) {
                throw error;
            }
            throw new InternalServerErrorException('Error following user');
        }
    }

    async unfollowUser(followerId: number, followingId: number): Promise<void> {
        try {
            await this.userRepository
                .createQueryBuilder()
                .delete()
                .from('users_follows_users')
                .where('userId_1 = :followerId AND userId_2 = :followingId', 
                    { followerId, followingId })
                .execute();
        } catch (error) {
            throw new InternalServerErrorException('Error unfollowing user');
        }
    }

    async getFollowers(userId: number, currentUserId?: number): Promise<FollowUserResponseDto[]> {
        try {
            const followers = await this.userRepository
                .createQueryBuilder('user')
                .innerJoin('users_follows_users', 'f', 'f.userId_1 = user.id')
                .where('f.userId_2 = :userId', { userId })
                .getMany();

            return Promise.all(followers.map(async follower => {
                const followersCount = await this.userRepository
                    .createQueryBuilder()
                    .select()
                    .from('users_follows_users', 'f')
                    .where('f.userId_2 = :followerId', { followerId: follower.id })
                    .getCount();

                let isFollowing = false;
                if (currentUserId) {
                    const followRelation = await this.userRepository
                        .createQueryBuilder()
                        .select()
                        .from('users_follows_users', 'f')
                        .where('f.userId_1 = :currentUserId AND f.userId_2 = :followerId',
                            { currentUserId, followerId: follower.id })
                        .getOne();
                    isFollowing = !!followRelation;
                }

                return {
                    id: follower.id,
                    username: follower.username,
                    followersCount,
                    isFollowing
                };
            }));
        } catch (error) {
            throw new InternalServerErrorException('Error getting followers');
        }
    }

    async getFollowing(userId: number, currentUserId?: number): Promise<FollowUserResponseDto[]> {
        try {
            const following = await this.userRepository
                .createQueryBuilder('user')
                .innerJoin('users_follows_users', 'f', 'f.userId_2 = user.id')
                .where('f.userId_1 = :userId', { userId })
                .getMany();

            return Promise.all(following.map(async followedUser => {
                const followersCount = await this.userRepository
                    .createQueryBuilder()
                    .select()
                    .from('users_follows_users', 'f')
                    .where('f.userId_2 = :followedId', { followedId: followedUser.id })
                    .getCount();

                let isFollowing = false;
                if (currentUserId) {
                    const followRelation = await this.userRepository
                        .createQueryBuilder()
                        .select()
                        .from('users_follows_users', 'f')
                        .where('f.userId_1 = :currentUserId AND f.userId_2 = :followedId',
                            { currentUserId, followedId: followedUser.id })
                        .getOne();
                    isFollowing = !!followRelation;
                }

                return {
                    id: followedUser.id,
                    username: followedUser.username,
                    followersCount,
                    isFollowing
                };
            }));
        } catch (error) {
            throw new InternalServerErrorException('Error getting following users');
        }
    }
}