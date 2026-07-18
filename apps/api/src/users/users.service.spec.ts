import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

const createUser = (overrides: Partial<User> = {}): User => ({
  id: '2a32f684-61fc-4f55-a25b-a8c277d7c1a7',
  name: 'Maria Silva',
  email: 'maria@exemplo.com',
  passwordHash: '$2b$10$hash',
  createdAt: new Date('2026-07-03T00:00:00.000Z'),
  updatedAt: new Date('2026-07-03T00:00:00.000Z'),
  ...overrides,
});

type PrismaUserCreateArgs = {
  data: Pick<User, 'name' | 'email' | 'passwordHash'>;
};

type PrismaUserFindUniqueArgs =
  | { where: { email: string } }
  | { where: { id: string } };

type PrismaMock = {
  user: {
    create: jest.Mock<Promise<User>, [PrismaUserCreateArgs]>;
    findUnique: jest.Mock<Promise<User | null>, [PrismaUserFindUniqueArgs]>;
  };
};

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaMock;

  beforeEach(() => {
    prisma = {
      user: {
        create: jest.fn<Promise<User>, [PrismaUserCreateArgs]>(),
        findUnique: jest.fn<Promise<User | null>, [PrismaUserFindUniqueArgs]>(),
      },
    };

    service = new UsersService(prisma as unknown as PrismaService);
  });

  it('creates a user with a password hash', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockImplementation(({ data }) =>
      Promise.resolve(
        createUser({
          name: data.name,
          email: data.email,
          passwordHash: data.passwordHash,
        }),
      ),
    );

    const user = await service.create({
      name: 'Maria Silva',
      email: 'maria@exemplo.com',
      password: 'senhaSegura123',
    });

    expect(prisma.user.create).toHaveBeenCalledTimes(1);
    expect(prisma.user.create.mock.calls[0][0].data).toMatchObject({
      name: 'Maria Silva',
      email: 'maria@exemplo.com',
    });
    expect(typeof prisma.user.create.mock.calls[0][0].data.passwordHash).toBe(
      'string',
    );
    expect(user.passwordHash).not.toBe('senhaSegura123');
    await expect(
      bcrypt.compare('senhaSegura123', user.passwordHash),
    ).resolves.toBe(true);
  });

  it('throws ConflictException when the email already exists', async () => {
    prisma.user.findUnique.mockResolvedValue(createUser());

    await expect(
      service.create({
        name: 'Maria Silva',
        email: 'maria@exemplo.com',
        password: 'senhaSegura123',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('maps unique constraint errors to ConflictException', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        clientVersion: '7.8.0',
        code: 'P2002',
      }),
    );

    await expect(
      service.create({
        name: 'Maria Silva',
        email: 'maria@exemplo.com',
        password: 'senhaSegura123',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('finds users by email and id', async () => {
    const user = createUser();
    prisma.user.findUnique
      .mockResolvedValueOnce(user)
      .mockResolvedValueOnce(user);

    await expect(service.findByEmail(user.email)).resolves.toEqual(user);
    await expect(service.findById(user.id)).resolves.toEqual(user);

    expect(prisma.user.findUnique).toHaveBeenNthCalledWith(1, {
      where: { email: user.email },
    });
    expect(prisma.user.findUnique).toHaveBeenNthCalledWith(2, {
      where: { id: user.id },
    });
  });

  it('removes private and persistence fields from responses', () => {
    expect(service.toResponse(createUser())).toEqual({
      id: '2a32f684-61fc-4f55-a25b-a8c277d7c1a7',
      name: 'Maria Silva',
      email: 'maria@exemplo.com',
    });
  });
});
