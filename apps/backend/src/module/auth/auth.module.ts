import { AuthService } from '@/module/auth/application/auth.service.js';
import { EmailVerificationService } from '@/module/auth/application/email.verification.service.js';
import { TokenService } from '@/module/auth/application/token.service.js';
import { RefreshSessionEntity } from '@/module/auth/domain/entities/refresh-session.entity.js';
import { SessionRepository } from '@/module/auth/domain/interfaces/refresh-session.repository.js';
import { OrmSessionRepository } from '@/module/auth/infrastructure/orm-session.repository.js';
import {
  SessionCleanupProcessor,
  SessionCleanupScheduler,
} from '@/module/auth/infrastructure/session-cleanup.js';
import { AuthController } from '@/module/auth/presentation/auth.controller.js';
import { MailModule } from '@/module/mail/mail.module.js';
import { UserModule } from '@/module/user/user.module.js';
import { AUTH_MAINTENANCE_QUEUE } from '@/shared/constants/auth.constants.js';
import { JwtAuthGuard } from '@/shared/guards/jwt/jwt-auth.guard.js';
import { RolesGuard } from '@/shared/guards/role/roles.guard.js';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({}),
    MikroOrmModule.forFeature([RefreshSessionEntity]),
    BullModule.registerQueue({ name: AUTH_MAINTENANCE_QUEUE }),
    UserModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    EmailVerificationService,
    { provide: SessionRepository, useClass: OrmSessionRepository },
    SessionCleanupScheduler,
    SessionCleanupProcessor,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
  exports: [TokenService],
})
export class AuthModule {}
