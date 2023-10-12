import {Body, Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {AuthGuard} from "../lib/auth.guard";
import * as fs from "fs";
import {join} from "path";
import {FileInterceptor} from "@nestjs/platform-express";
import {Express} from "express";

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

        const [createdAt, ext] = firstFileName.split('.')

        switch (ext) {
            case 'txt':
                return {
                    type: 'text',
                    data: fs.readFileSync(filePath, 'utf-8'),
                    createdAt: Number(createdAt)
                }
            case 'png':
                return {
                    type: 'image',
                    data: fs.readFileSync(filePath).toString('base64'),
                    createdAt: Number(createdAt)
                }
        }
    }

    @Post('upload/text')
    async uploadText(@Body() body) {
        const path = join(this.DIRECTORY_PATH, `${Date.now()}.txt`)

        fs.writeFileSync(path, body.text)
    }

    @Post('upload/image')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        const path = join(this.DIRECTORY_PATH, `${Date.now()}.png`)

        fs.writeFileSync(path, file.buffer)
    }
}
