import {Controller, Get, NotFoundException, UseGuards} from '@nestjs/common';
import {AuthGuard} from "../lib/auth.guard";

@Controller('api/board')
@UseGuards(AuthGuard)
export class BoardController {

    @Get('list')
    async getList() {
        return 'Implement me'
    }
}
