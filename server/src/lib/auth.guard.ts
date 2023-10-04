import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {UserService} from "../user/user.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly userService: UserService
    ) {}

    canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const authorization = req.headers.authorization;
        const hashedPassword = this.userService.getHashed(process.env.PASSWORD)
        return authorization?.startsWith('Bearer ') && authorization.split('Bearer ')[1] === hashedPassword;
    }
}
