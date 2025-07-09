import prisma from '@/config/prisma-client';
import { findByEmail, findByusername } from '@/services/common';
import { createUserService } from '@/services/user.services';
import { appError } from '@/utils/appError';
import { generateRandomPassword, hashPassword } from '@/utils/password';
import { describe, expect, it, vi } from 'vitest';


vi.mock('@/config/prisma-client');
vi.mock('@/utils/appError');
vi.mock('@/utils/password');
vi.mock('./common');

const mockCreateUserInput = {
  fullNames: 'John Doe',
  emailAddress: 'john@example.com',
  username: 'johndoe'
};

describe('createUserService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw an error if email already exists', async () => {
    (findByEmail as vi.Mock).mockResolvedValue(true);
    
    await expect(createUserService(mockCreateUserInput)).rejects.toThrow();
    expect(appError).toHaveBeenCalledWith('Email is already registered', 409, 'EMAIL_EXISTS');
  });

  it('should throw an error if username already exists', async () => {
    (findByEmail as vi.Mock).mockResolvedValue(false);
    (findByusername as vi.Mock).mockResolvedValue(true);
    
    await expect(createUserService(mockCreateUserInput)).rejects.toThrow();
    expect(appError).toHaveBeenCalledWith('Username is already taken', 409, 'USERNAME_EXISTS');
  });

  it('should create a new user with valid input', async () => {
    (findByEmail as vi.Mock).mockResolvedValue(false);
    (findByusername as vi.Mock).mockResolvedValue(false);
    const mockPassword = 'randomPassword';
    const mockHashedPassword = 'hashedPassword';
    (generateRandomPassword as vi.Mock).mockReturnValue(mockPassword);
    (hashPassword as vi.Mock).mockResolvedValue(mockHashedPassword);
    const mockCreatedUser = { ...mockCreateUserInput, password: mockHashedPassword };
    (prisma.user.create as vi.Mock).mockResolvedValue(mockCreatedUser);

    const result = await createUserService(mockCreateUserInput);

    expect(generateRandomPassword).toHaveBeenCalled();
    expect(hashPassword).toHaveBeenCalledWith(mockPassword);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        fullNames: mockCreateUserInput.fullNames,
        emailAddress: mockCreateUserInput.emailAddress,
        username: mockCreateUserInput.username,
        password: mockHashedPassword
      }
    });
    expect(result).toEqual(mockCreatedUser);
  });
});