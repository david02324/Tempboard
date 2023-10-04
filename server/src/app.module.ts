import { Module } from '@nestjs/common';
import {ServeStaticModule} from "@nestjs/serve-static";
import { join } from 'path';
import { UserModule } from './user/user.module';
import { BoardModule } from './board/board.module';

const STATIC_PATH = process.env.NODE_ENV === 'local'
    ? join(__dirname, '..', '..', 'web', 'dist')
    : join(__dirname, '..', 'web');

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: STATIC_PATH,
    }),
    UserModule,
    BoardModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
