import { UserRepository } from './../user-repository/user-repository';
import { Connection } from './../connection/connection';
import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpException,
  HttpRedirectResponse,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
  // UseFilters,
} from '@nestjs/common';
import { Request, Response, query } from 'express';
import { UserService } from './user.service';
import { MailService } from '../mail/mail.service';
import { MemberService } from '../member/member.service';
import { User } from '@prisma/client';
import { ValidationFilter } from 'src/validation/validation.filter';
import { ValidationPipe } from 'src/validation/validation.pipe';
import {
  LoginUserRequest,
  loginUserRequestValidation,
} from 'src/model/login.model';
import { TimeInterceptor } from 'src/time/time.interceptor';
import { Auth } from 'src/auth/auth.decorator';
import { RoleGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/role.decorator';
// import { ValidationFilter } from 'src/validation/validation.filter';\\

// @UseGuards(RoleGuard)
@Controller('/api/users')
export class UserController {
  constructor(
    private service: UserService,
    private connection: Connection,
    private mailService: MailService,
    private userRepository: UserRepository,
    private memberService: MemberService,
    @Inject('EmailService') private emailService: MailService,
  ) {}

  @Get('/current')
  // @UseGuards(RoleGuard)
  @Roles(['admin', 'operator'])
  current(@Auth() user: User): Record<string, any> {
    return {
      data: `Hello ${user.first_name} ${user.last_name}`,
    };
  }

  @UsePipes(new ValidationPipe(loginUserRequestValidation))
  @UseFilters(ValidationFilter)
  @Post('/login')
  @Header('Content-Type', 'application/json')
  @UseInterceptors(TimeInterceptor)
  login(
    @Query('name') name: string,
    @Body()
    request: LoginUserRequest,
  ) {
    return {
      data: `Hello ${request.email}`,
    };
  }
  // login(
  //   @Body(new ValidationPipe(loginUserRequestValidation))
  //   request: LoginUserRequest,
  // ) {
  //   return `Hello ${request.email}`;
  // }
  @Get('/create')
  async create(
    @Query('email') email: string,
    @Query('first_name') firstName: string,
    @Query('last_name') lastName: string,
    @Query('role') role: string,
  ): Promise<User> {
    if (!firstName || !lastName) {
      throw new HttpException(
        {
          code: 400,
          errors: 'First name and last name is required',
        },
        400,
      );
    }
    return this.userRepository.save(email, firstName, lastName, role);
  }

  @Get('/connection')
  async getConnection(): Promise<string> {
    this.mailService.send();
    this.emailService.send();
    console.info(this.memberService.getConnections());
    this.memberService.sendEmail();
    return this.connection.getName();
  }

  @Get('/hello-inject')
  // @UseFilters(ValidationFilter)
  async sayHelloInject(@Query('name') name: string): Promise<string> {
    return this.service.sayHello(name);
  }

  @Get('/view/hello')
  viewHello(@Query('name') name: string, @Res() response: Response) {
    response.render('index.html', {
      title: 'Templates',
      name: name,
    });
  }
  @Get('/set-cookie')
  setCookie(@Query('name') name: string, @Res() response: Response) {
    response.cookie('name', name);
    response.status(200).send('Success! set-cookie');
  }

  @Get('/get-cookie')
  getCookie(@Req() request: Request): string {
    return request.cookies['name'];
  }

  @Get('/hello-async')
  async sayHelloAsync(
    @Query('first_name') firstName: string,
    @Query('last_name') lastName: string,
  ): Promise<string> {
    return `Bonjour ${firstName} ${lastName}`;
  }
  @Get('/sample-response2')
  @Header('Content-Type', 'application/json')
  @HttpCode(200)
  sampleResponse2(): Record<string, string> {
    return {
      data: 'Hello Nestjs',
    };
  }

  @Get('/redirect')
  @Redirect()
  redirect(): HttpRedirectResponse {
    return {
      url: '/api/users/sample-response',
      statusCode: 301,
    };
  }

  @Get('/sample-response')
  sampleResponse(@Res() response: Response) {
    response.status(200).send('Sample Response');
  }

  @Get('/hello')
  sayHello(
    @Query('first_name') firstName: string,
    @Query('last_name') lastName: string,
  ): string {
    return `Bonjour ${firstName} ${lastName}`;
  }

  @Post()
  post(): string {
    return 'POST';
  }
  @Get('/sample')
  get(): string {
    return 'GET';
  }
  @Get('/pipe/:id')
  getByIdPipe(@Param('id', ParseIntPipe) id: number): string {
    return `GET ${id}`;
  }

  @Get('/:id')
  getById(@Req() request: Request): string {
    return `GET ${request.params.id}`;
  }

  @Get()
  sayHello2(@Query('name') name: string): string {
    return `Hello ${name}`;
  }
}
