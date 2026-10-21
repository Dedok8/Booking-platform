import { Env } from '@/core/config/validation/env.validation.js';
import { throttlerConfig } from '@/core/throttler/throttler.config.js';
import {
  AuthService,
  IAuthResult,
} from '@/module/auth/application/auth.service.js';
import {
  ChangePasswordDto,
  ConfirmEmailDto,
  LoginDto,
  RegisterDto,
  ResendConfirmationDto,
} from '@/module/auth/application/dto/auth.dto.js';
import { TokenService } from '@/module/auth/application/token.service.js';
import {
  type AuthUser,
  SessionMeta,
} from '@/module/auth/domain/types/auth.types.js';
import { toUserDto } from '@/module/user/application/mapper/user.mapper.js';
import { CurrentUser } from '@/shared/decorators/current-user.decorator.js';
import { Public } from '@/shared/decorators/public.decorator.js';
import { AppError } from '@/shared/lib/error.js';
import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import { type Request, type Response } from 'express';

const REFRESH_COOKIE = 'refresh_token';
const REFRESH_COOKIE_PATH = '/api/auth';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly tokens: TokenService,
    private readonly config: ConfigService<Env, true>,
  ) {}

  @Public()
  @Post('register')
  @Throttle({ default: throttlerConfig.register })
  async register(@Body() body: RegisterDto) {
    return toUserDto(await this.auth.register(body));
  }

  @Public()
  @Post('confirm-email')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Throttle({ default: throttlerConfig.email })
  async confirmEmail(@Body() body: ConfirmEmailDto): Promise<void> {
    await this.auth.confirmEmail(body);
  }

  @Public()
  @Post('resend-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Throttle({ default: throttlerConfig.default })
  async resendConfirmation(@Body() body: ResendConfirmationDto): Promise<void> {
    await this.auth.resendConfirmation(body);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Header('Cache-Control', 'no-store')
  @Throttle({ default: throttlerConfig.login })
  async login(
    @Body() body: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.respond(res, await this.auth.login(body, this.meta(req)));
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @Header('Cache-Control', 'no-store')
  @Throttle({ default: throttlerConfig.refresh })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = this.readRefreshCookie(req);
    if (!token) throw AppError.unauthorized();
    return this.respond(res, await this.auth.refresh(token, this.meta(req)));
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.auth.logout(this.readRefreshCookie(req));
    this.clearRefreshCookie(res);
  }

  @Post('logout-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logoutAll(
    @CurrentUser() user: AuthUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.auth.logoutAll(user.id);
    this.clearRefreshCookie(res);
  }

  @Get('me')
  async me(@CurrentUser() user: AuthUser) {
    return toUserDto(await this.auth.getMe(user.id));
  }

  @Post('change-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async changePassword(
    @CurrentUser() user: AuthUser,
    @Body() body: ChangePasswordDto,
  ): Promise<void> {
    await this.auth.changePassword(user.id, user.sessionId, body);
  }

  private respond(res: Response, result: IAuthResult) {
    res.cookie(REFRESH_COOKIE, result.refreshToken, {
      httpOnly: true,
      secure: this.config.get('NODE_ENV', { infer: true }) === 'production',
      sameSite: 'lax',
      path: REFRESH_COOKIE_PATH,
      maxAge: this.tokens.refreshTtlSecond * 1000,
    });
    return { accessToken: result.accessToken, user: toUserDto(result.user) };
  }

  private clearRefreshCookie(res: Response): void {
    res.clearCookie(REFRESH_COOKIE, { path: REFRESH_COOKIE_PATH });
  }

  private readRefreshCookie(req: Request): string | undefined {
    const value: unknown = req.cookies?.[REFRESH_COOKIE];
    return typeof value === 'string' && value ? value : undefined;
  }

  private meta(req: Request): SessionMeta {
    return {
      ip: req.ip ?? null,
      userAgent: req.headers['user-agent'] ?? null,
    };
  }
}
