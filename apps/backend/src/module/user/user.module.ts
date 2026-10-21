import { HashService } from '@/core/hash/hash.service.js';
import { UserService } from '@/module/user/application/user.service.js';
import { UserEntity } from '@/module/user/domain/entities/user.entity.js';
import { UserRepository } from '@/module/user/domain/interfaces/user.repository.js';
import { OrmUserRepository } from '@/module/user/infrastructure/orm-user.repository.js';
import { UserController } from '@/module/user/presentation/user.controller.js';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    UserService,
    HashService,
    { provide: UserRepository, useClass: OrmUserRepository },
  ],
  exports: [UserService, HashService],
})
export class UserModule {}
