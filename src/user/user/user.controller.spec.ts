import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import * as httpMock from 'node-mocks-http';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      imports: [],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should can say hello', async () => {
    const response = await controller.sayHello('roihan', 'sori');
    expect(response).toBe('Bonjour roihan sori');
  });

  it('should can say hello inject', async () => {
    const response = await controller.sayHelloInject('roihan');
    expect(response).toBe('Hello roihan');
  });

  it('should can get view', async () => {
    const respone = httpMock.createResponse();
    controller.viewHello('roihan', respone);

    expect(respone._getRenderView()).toBe('index.html');
    expect(respone._getRenderData()).toEqual({
      name: 'roihan',
      title: 'Templates',
    });
  });
});
