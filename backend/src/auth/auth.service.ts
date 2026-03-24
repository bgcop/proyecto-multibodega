import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && await bcrypt.compare(pass, user.password_hash)) {
      const payload = { email: user.email, sub: user.id, role: user.role?.name };
      return { access_token: this.jwtService.sign(payload) };
    }
    throw new UnauthorizedException('Credenciales inválidas');
  }

  // Base utilitaria para crear admin inicial
  async seedAdmin() {
    let role = await this.roleRepository.findOne({ where: { name: 'admin' } });
    if (!role) {
      role = this.roleRepository.create({ name: 'admin', permissions: { all: true } });
      await this.roleRepository.save(role);
    }
    
    // Validar si existe algun admin
    const exist = await this.userRepository.findOne({ where: { email: 'admin@sistema.local' }});
    if (!exist) {
      const hash = await bcrypt.hash('admin123', 10);
      const newAdmin = this.userRepository.create({ email: 'admin@sistema.local', name: 'Administrador', password_hash: hash, role });
      await this.userRepository.save(newAdmin);
      return { status: 'Admin Seeded' };
    }
    return { status: 'Already exists' };
  }
}
