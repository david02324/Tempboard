import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import {AuthGuard} from "../lib/auth.guard";
import * as fs from "fs";
import {join} from "path";

@Controller('api/board')
@UseGuards(AuthGuard)
export class BoardController {

    private readonly DIRECTORY_PATH = join(__dirname, 'files')

    constructor() {
        if (!fs.existsSync(this.DIRECTORY_PATH)) {
            fs.mkdirSync(this.DIRECTORY_PATH, { recursive: true })
        }
    }

    @Get('recent')
    async getRecent() {
        const files = fs.readdirSync(this.DIRECTORY_PATH)
        if (files.length === 0) return { type: 'null' }

        files.sort((a, b) => b.localeCompare(a));
        const firstFileName = files[0]
        const filePath = join(this.DIRECTORY_PATH, firstFileName)

        return {
            type: 'text',
            data: fs.readFileSync(filePath, 'utf-8')
        }
    }

    @Post('upload/text')
    async uploadText(@Body() body) {
        const path = join(this.DIRECTORY_PATH, `${Date.now()}.txt`)

        fs.writeFileSync(path, body.text)
    }
}
