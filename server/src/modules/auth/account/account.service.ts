import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserModel } from './models/user.model';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { CreateUserInput } from './inputs/create-user.input';

@Injectable()
export class AccountService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<UserModel[]> {
    const users = await this.prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return users.map(user => ({
      ...user,
      avatar: user.avatar || '',
      bio: user.bio || ''
    }));
  }

  public async create(input: CreateUserInput) {
    // Destructure username, email, password from input
    const { username, email, password } = input;

    // Check if username or email already exists in the database
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    // If yes, throw ConflictException
    if (existingUser) {
      throw new ConflictException(
        existingUser.username === username
          ? 'Username already exists'
          : 'Email already exists'
      );
    }

    // Create new user with hashed password, email, default displayName from username
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        displayName: username
      }
    });

  //  return true;
  return {
      ...newUser,
      avatar: newUser.avatar || '',
      bio: newUser.bio || ''
   }
  }
}
