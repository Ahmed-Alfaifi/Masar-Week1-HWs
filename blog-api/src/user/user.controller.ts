import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(
        @Body('username') username: string,
        @Body('password') password: string,
    ) {
        const user = await this.userService.register(username, password);
        const { password: _, ...result } = user;
        return result;
    }

    @UseGuards(JwtAuthGuard)
    @Get('myProfile')
    @HttpCode(HttpStatus.OK)
    async getMyProfile(@Request() req) {
        try {
            console.log('Getting my profile for user:', req.user.userId);
            return await this.userService.getProfile(req.user.userId);
        } catch (error) {
            console.error('MyProfile error:', error);
            throw error;
        }
    }

    @Get(':id/profile')
    @HttpCode(HttpStatus.OK)
    async getProfile(@Param('id', ParseIntPipe) id: number, @Request() req) {
        try {
            console.log('Getting profile for user:', id);
            const currentUserId = req.user?.userId;
            console.log('Current user ID:', currentUserId);
            const profile = await this.userService.getProfile(id, currentUserId);
            console.log('Profile retrieved:', profile);
            return profile;
        } catch (error) {
            console.error('Profile error:', error);
            throw error;
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/follow')
    @HttpCode(HttpStatus.OK)
    async followUser(
        @Request() req,
        @Param('id', ParseIntPipe) followingId: number
    ) {
        await this.userService.followUser(req.user.userId, followingId);
        return { message: 'User followed successfully' };
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id/follow')
    @HttpCode(HttpStatus.OK)
    async unfollowUser(
        @Request() req,
        @Param('id', ParseIntPipe) followingId: number
    ) {
        await this.userService.unfollowUser(req.user.userId, followingId);
        return { message: 'User unfollowed successfully' };
    }

    @Get(':id/followers')
    @HttpCode(HttpStatus.OK)
    async getFollowers(
        @Param('id', ParseIntPipe) id: number,
        @Request() req
    ) {
        const currentUserId = req.user?.userId;
        return this.userService.getFollowers(id, currentUserId);
    }

    @Get(':id/following')
    @HttpCode(HttpStatus.OK)
    async getFollowing(
        @Param('id', ParseIntPipe) id: number,
        @Request() req
    ) {
        const currentUserId = req.user?.userId;
        return this.userService.getFollowing(id, currentUserId);
    }
}