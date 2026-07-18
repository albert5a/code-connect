import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: {
    create: jest.Mock;
    findByEmail: jest.Mock;
    toResponse: jest.Mock;
  };
  let jwtService: {
    sign: jest.Mock;
  };

  beforeEach(() => {
    usersService = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      toResponse: jest.fn(),
    };
    jwtService = {
      sign: jest.fn().mockReturnValue('signed-token'),
    };

    service = new AuthService(
      usersService as unknown as UsersService,
      jwtService as unknown as JwtService,
    );
  });

  it('validates users by comparing the password hash', async () => {
    const passwordHash = await bcrypt.hash('senhaSegura123', 10);
    const user = {
      id: '2a32f684-61fc-4f55-a25b-a8c277d7c1a7',
      name: 'Maria Silva',
      email: 'maria@exemplo.com',
      passwordHash,
      createdAt: new Date('2026-07-03T00:00:00.000Z'),
      updatedAt: new Date('2026-07-03T00:00:00.000Z'),
    };
    usersService.findByEmail.mockResolvedValue(user);

    await expect(
      service.validateUser('maria@exemplo.com', 'senhaSegura123'),
    ).resolves.toEqual(user);
    await expect(
      service.validateUser('maria@exemplo.com', 'senhaErrada'),
    ).resolves.toBeNull();
  });

  it('returns a signed token for a valid login', async () => {
    const passwordHash = await bcrypt.hash('senhaSegura123', 10);
    usersService.findByEmail.mockResolvedValue({
      id: '2a32f684-61fc-4f55-a25b-a8c277d7c1a7',
      name: 'Maria Silva',
      email: 'maria@exemplo.com',
      passwordHash,
    });

    await expect(
      service.login({
        email: 'maria@exemplo.com',
        password: 'senhaSegura123',
      }),
    ).resolves.toEqual({ access_token: 'signed-token' });

    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: '2a32f684-61fc-4f55-a25b-a8c277d7c1a7',
      email: 'maria@exemplo.com',
      name: 'Maria Silva',
    });
  });
});
