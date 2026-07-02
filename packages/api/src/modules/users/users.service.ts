import { Injectable } from "@nestjs/common";
import prisma from "@lsp/database";
import { UserRole } from "@lsp/shared";

@Injectable()
export class UsersService {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async createUser(data: {
    email: string;
    name: string;
    passwordHash: string;
    role?: UserRole;
    companyId?: string;
  }) {
    return prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash: data.passwordHash,
        role: data.role ?? UserRole.CLIENT_USER,
        companyId: data.companyId,
      },
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
