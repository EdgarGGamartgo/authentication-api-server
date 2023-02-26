import { Injectable } from '@nestjs/common';
import { PrismaService } from './_services';
import { CreateUserDto } from './_dto';
import { User } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async authedUser(base64: string) {
    const decoded = Buffer.from(base64, 'base64').toString('utf8');
    if (decoded) {
      const [user_id, password] = decoded.split(':');
      const user = await this.prisma.user.findFirst({
        where: {
          user_id,
          password,
        },
      });
      if (user?.id) return user;
    }
    return null;
  }

  async deleteUserAccount({ id }: User) {
    return await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async fetchUser(user_id: string) {
    const user = await this.prisma.user
      .findUnique({
        where: {
          user_id,
        },
      })
      .then((data) => {
        if (data?.id) {
          delete data.id;
          delete data.password;
          if (data?.nickname && data?.nickname === data?.user_id) {
            delete data.comment;
          }

          return {
            message: 'User details by user_id',
            user: data,
          };
        }
        return null;
      });

    if (!user) return 404;

    return user;
  }

  async createUserAccount({ user_id, password }: CreateUserDto) {
    const user = await this.fetchUser(user_id);
    if (user && user !== 404) return 400;

    const prismaPayload = {
      data: {
        user_id,
        password,
        nickname: user_id,
      },
    };

    return await this.prisma.user.create(prismaPayload).then((data) => {
      if (data?.id) {
        delete data.id;
        delete data.password;
        if (data?.nickname && data?.nickname === data?.user_id) {
          delete data.comment;
        }
        return {
          message: 'Account successfully created',
          user: data,
        };
      }
      return null;
    });
  }
}
