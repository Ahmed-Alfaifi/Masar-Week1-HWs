import { IsNumber, IsString, IsBoolean, IsDate, IsOptional } from 'class-validator';

export class ProfileResponseDto {
    @IsNumber()
    id: number;

    @IsString()
    username: string;

    @IsNumber()
    followersCount: number;

    @IsNumber()
    followingCount: number;

    @IsNumber()
    articlesCount: number;

    @IsOptional()
    @IsBoolean()
    isFollowing?: boolean;

    @IsDate()
    createdAt: Date;
}

export class FollowUserResponseDto {
    @IsNumber()
    id: number;

    @IsString()
    username: string;

    @IsNumber()
    followersCount: number;

    @IsBoolean()
    isFollowing: boolean;
}