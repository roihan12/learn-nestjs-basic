import { MailService } from './../mail/mail.service';
import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Connection } from '../connection/connection';

@Injectable()
export class MemberService {
  constructor(private moduleRef: ModuleRef) {}

  getConnections(): string {
    const connection = this.moduleRef.get(Connection);
    return connection.getName();
  }

  sendEmail() {
    const mailService = this.moduleRef.get(MailService);
    mailService.send();
  }
}
