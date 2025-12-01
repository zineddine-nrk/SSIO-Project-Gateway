import { Injectable } from '@nestjs/common';
import { KeyrockAuthService } from '../fiware/keyrock/services/auth.service';

@Injectable()
export class AuthService {
  constructor(private readonly keyrockAuthService: KeyrockAuthService) {}

  async login(email: string, password: string) {
    return this.keyrockAuthService.getToken({ email, password });
  }

  async validateToken(token: string) {
    return this.keyrockAuthService.getTokenInfo({
      X_Auth_token: token,
      X_Subject_token: token,
    });
  }
}
