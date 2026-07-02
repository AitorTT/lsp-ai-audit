import { UserRole } from "@lsp/shared";

export class AuthResponseDto {
  accessToken: string;

  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}
