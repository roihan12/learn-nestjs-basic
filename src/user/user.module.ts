import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { Connection, createConnection } from './connection/connection';
import { MailService, mailService } from './mail/mail.service';
import { UserRepository } from './user-repository/user-repository';
import { MemberService } from './member/member.service';
import { ConfigService } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  // imports: [PrismaModule],
  imports: [],
  controllers: [UserController],
  providers: [
    UserService,
    // {
    //   provide: Connection,
    //   useClass:
    //     process.env.DATABASE == 'mysql' ? MySQLConnection : MongoConnection,
    // },
    {
      provide: Connection,
      useFactory: createConnection,
      inject: [ConfigService],
    },
    {
      provide: MailService,
      useValue: mailService,
    },

    UserRepository,

    {
      provide: 'EmailService',
      useExisting: MailService,
    },
    MemberService,
  ],
  exports: [UserService],
})
export class UserModule {}
