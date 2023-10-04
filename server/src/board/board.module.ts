import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import {UserService} from "../user/user.service";

@Module({
  controllers: [BoardController],
  providers: [UserService]
})
export class BoardModule {}
