import { z } from 'zod';

export class LoginUserRequest {
  email: string;
  password: string;
}

export const loginUserRequestValidation = z.object({
  email: z.string().max(50).min(1).email(),
  password: z.string().max(50).min(1),
});
