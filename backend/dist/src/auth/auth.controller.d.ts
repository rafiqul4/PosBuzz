import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
}
