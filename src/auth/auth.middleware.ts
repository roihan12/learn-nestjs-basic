import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private prismaService: PrismaService) {}
  async use(req: any, res: any, next: () => void) {
    const id = Number(req.headers['x-id']);
    if (!id) {
      throw new HttpException('Unauthorized', 401);
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
    });

    if (user) {
      req.user = user;

      next();
    } else {
      throw new HttpException('Unauthorized', 401);
    }
  }
}
