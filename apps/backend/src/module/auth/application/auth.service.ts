import { HashService } from '@/core/hash/hash.service.js';
import {
  ConfirmEmailDto,
  LoginDto,
  RegisterDto,
  ResendConfirmationDto,
} from '@/module/auth/application/dto/auth.dto.js';
import { EmailVerificationService } from '@/module/auth/application/email.verification.service.js';
import { TokenService } from '@/module/auth/application/token.service.js';
import { SessionRepository } from '@/module/auth/domain/interfaces/refresh-session.repository.js';
import { SessionMeta } from '@/module/auth/domain/types/auth.types.js';
import { MailService } from '@/module/mail/mail.service.js';
import { ChangePasswordDto } from '@/module/user/application/dto/user.dto.js';
import { UserService } from '@/module/user/application/user.service.js';
import { User } from '@/module/user/domain/entities/user.entity.js';
import { AppError } from '@/shared/lib/error.js';
import { Injectable } from '@nestjs/common';
import { randomBytes, randomUUID } from 'node:crypto';

export interface IAuthResult {
  accessToken: string;
  refreshToken: string;
  user: User;
}

@Injectable()
export class AuthService {
  private dummyHash?: Promise<string>;
  constructor(
    private readonly users: UserService,
    private readonly token: TokenService,
    private readonly verification: EmailVerificationService,
    private readonly mail: MailService,
    private readonly sessions: SessionRepository,
    private readonly hashService: HashService,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.users.register(dto);
    await this.sendCode(user);

    return user;
  }

  async confirmEmail(dto: ConfirmEmailDto): Promise<void> {
    const user = await this.users.findByEmail(dto.email);
    if (!user || user.emailVerifiedAt) {
      throw AppError.invalidCode();
    }

    await this.verification.verify(user.id, dto.code);
    await this.users.markEmailVerified(user.id);
  }

  async resendConfirmation(dto: ResendConfirmationDto): Promise<void> {
    const user = await this.users.findByEmail(dto.email);

    if (!user || user.emailVerifiedAt) return;
    if (!(await this.verification.acquireResendSlot(user.id))) return;
    await this.sendCode(user);
  }

  async login(dto: LoginDto, meta: SessionMeta): Promise<IAuthResult> {
    const user = await this.users.findByEmail(dto.email);

    const hash = user?.passwordHash ?? (await this.getDummyHash());
    const passwordOk = await this.hashService.compare(dto.password, hash);

    if (!user || !passwordOk) {
      throw AppError.invalidCredentials();
    }

    if (!user.emailVerifiedAt) {
      throw AppError.emailNotVerified();
    }

    return this.issueSession(user, meta, randomUUID());
  }

  async refresh(refreshToken: string, meta: SessionMeta): Promise<IAuthResult> {
    const payload = await this.token.verifyRefresh(refreshToken);
    const session = await this.sessions.findById(payload.sid);

    if (
      !session ||
      session.user.id !== payload.sub ||
      session.familyId !== payload.fid ||
      this.token.matches(refreshToken, session.tokenHash) ||
      session.expiresAt.getTime() <= Date.now()
    ) {
      throw AppError.unauthorized;
    }

    const claimed = await this.sessions.revokeIfActive(session.id);
    if (!claimed) {
      await this.sessions.revokeFamily(session.familyId);
      throw AppError.unauthorized;
    }

    const user = await this.users.findById(payload.sub);
    if (!user) throw AppError.unauthorized();

    return this.issueSession(user, meta, session.familyId);
  }

  async logout(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) return;

    try {
      const payload = await this.token.verifyRefresh(refreshToken);
      await this.sessions.revokeFamily(payload.fid);
    } catch (error) {
      if (!(error instanceof AppError)) throw error;
    }
  }

  async logoutAll(userId: string): Promise<void> {
    await this.sessions.revokeAllForUser(userId);
  }

  async getMe(userId: string): Promise<User> {
    return this.users.findById(userId);
  }

  async changePassword(
    userId: string,
    sessionId: string,
    dto: ChangePasswordDto,
  ): Promise<void> {
    const user = this.users.findById(userId);
    const ok = await this.hashService.compare(
      dto.currentPassword,
      (await user).passwordHash,
    );

    if (!ok) throw AppError.invalidCredentials();

    await this.users.setPassword(userId, dto.newPassword);

    await this.sessions.revokeAllForUser((await user).id, sessionId);
  }

  private async sendCode(user: User): Promise<void> {
    const code = await this.verification.issue(user.id);

    await this.mail.sendVerificationCode(user.email, code);
  }

  private async issueSession(
    user: User,
    meta: SessionMeta,
    familyId: string,
  ): Promise<IAuthResult> {
    const sessionId = randomUUID();

    const refreshToken = await this.token.signRefreshToken({
      sub: user.id,
      sid: sessionId,
      fid: familyId,
    });

    const accessToken = await this.token.signAccessToken({
      sub: user.id,
      sid: sessionId,
      role: user.role,
    });

    this.sessions.create({
      id: sessionId,
      userId: user.id,
      familyId,
      tokenHash: this.token.hash(refreshToken),
      expiresAt: new Date(Date.now() + this.token.refreshTtlSecond * 1000),
      userAgent: meta.userAgent?.slice(0, 255) ?? null,
      ip: meta.ip,
    });

    await this.sessions.flush();
    return { accessToken, refreshToken, user };
  }

  private getDummyHash(): Promise<string> {
    this.dummyHash ??= this.hashService.hash(randomBytes(16).toString('hex'));
    return this.dummyHash;
  }
}
