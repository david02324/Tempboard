import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto'

@Injectable()
export class UserService {
    checkPassword(plainPassword: string): boolean {
        return process.env.PASSWORD === plainPassword
    }

    getHashed(plainPassword: string): string {
        const hash = createHash('sha256')
        hash.update(plainPassword)
        return hash.digest('hex')
    }
}
