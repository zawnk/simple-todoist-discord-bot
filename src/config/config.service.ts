import * as dotenv from 'dotenv'

export class ConfigService {
  constructor() {
    dotenv.config()
  }

  public get(name: string): string {
    return process.env[name]
  }
}
