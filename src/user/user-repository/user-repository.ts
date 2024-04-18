import { Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
// import { Connection } from '../connection/connection';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { Logger } from 'winston';
@Injectable()
export class UserRepository {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {
    this.logger.info('Create User repository');
  }

  async save(
    email: string,
    firstName: string,
    lastName?: string,
    role?: string,
  ): Promise<User> {
    this.logger.info(`Create user ${firstName} ${lastName}`);
    return await this.prisma.user.create({
      data: {
        email,
        first_name: firstName,
        last_name: lastName,
        role,
      },
    });
  }
}
