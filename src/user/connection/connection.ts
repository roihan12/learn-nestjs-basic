import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class Connection {
  getName(): string {
    return null;
  }
}
@Injectable()
export class MySQLConnection extends Connection {
  getName(): string {
    return 'MySQL Connection';
  }
}

@Injectable()
export class MongoConnection extends Connection {
  getName(): string {
    return 'Mongo Connection';
  }
}

export function createConnection(configService: ConfigService): Connection {
  if (configService.get('DATABASE') == 'mysql') {
    return new MySQLConnection();
  } else {
    return new MongoConnection();
  }
}
