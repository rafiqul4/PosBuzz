import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        user: {
            email: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        };
        access_token: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: {
            email: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        };
        access_token: string;
    }>;
    validateUser(id: number): Promise<{
        email: string;
        password: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    } | null>;
}
