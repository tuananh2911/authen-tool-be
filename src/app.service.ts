import { Injectable } from '@nestjs/common';
import { SignInDto } from './dtos/sign-in.dto';
import { AccessToolDto } from './dtos/access-tool.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { Policy } from './entities/policy.entity';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { addDays } from 'date-fns';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Policy)
    private policyRepository: Repository<Policy>,
  ) {}

  async author(data: SignInDto) {
    try {
      const user = await this.userRepository.findOneBy({
        username: data.username,
      });
      if (user.password === data.password) {
        console.log(user.username);
        return {
          code: 200,
          status: 'success',
          username: user.username,
        };
      } else {
        return {
          code: 400,
          status: 'error',
          message: 'Invalid username or password',
        };
      }
    } catch (error) {
      return {
        code: 400,
        status: 'error',
        message: 'Invalid username or password',
      };
    }
  }

  async accessTool(data: AccessToolDto) {
    try {
      const policy = await this.policyRepository.findOneBy({
        username: data.username,
      });
      if (policy.cpuId === data.cpuId) {
        return {
          code: 200,
          status: 'success',
          message: 'Access granted',
        };
      } else {
        return {
          code: 403,
          status: 'error',
          message: 'Access denied',
        };
      }
    } catch (error) {
      return {
        code: 400,
        status: 'error',
        message: 'Access denied',
      };
    }
  }

  async createUser(data: SignUpDto) {
    try {
      const policy = await this.policyRepository.findOneBy({
        cpuId: data.cpuId,
      });
      if (policy) {
        return {
          code: 400,
          status: 'error',
          message: 'Máy tính nãy đã được đăng ký bởi 1 tài khoản khác!',
        };
      }
    } catch (error) {
      try {
        const user = new User();
        user.username = data.username;
        user.password = data.password;
        await this.userRepository.save(user);
        const policy = new Policy();
        policy.cpuId = data.cpuId;
        policy.username = data.username;
        const currentDate: Date = new Date();
        const newDate = addDays(currentDate, 30);
        policy.expirationDate = newDate;
        await this.policyRepository.save(policy);
        return {
          code: 201,
          status: 'success',
          message: 'User created',
        };
      } catch (error) {
        return {
          code: 400,
          status: 'error',
          message: 'Máy tính nãy đã được đăng ký bởi 1 tài khoản khác!',
        };
      }
    }
  }
}
