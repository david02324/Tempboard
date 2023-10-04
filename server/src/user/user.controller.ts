import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    Post,
    Req,
    Res,
    UnauthorizedException
} from '@nestjs/common';
import {UserService} from "./user.service";

@Controller('api/user')
export class UserController {

    constructor(
        private readonly userService: UserService
    ) {}

    @Get('name')
    async getName() {
        return {
            name: process.env.NAME || 'Anonymous'
        }
    }

    @Post('enter')
    @HttpCode(202)
    enter(@Body() body) {
        if (body.password === undefined) {
            throw new BadRequestException()
        }

        if (!this.userService.checkPassword(body.password)) {
            throw new UnauthorizedException()
        }

        return {
            hashed: this.userService.getHashed(body.password)
        }
    }
}
