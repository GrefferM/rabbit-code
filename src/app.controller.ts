import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  public async checkApplication(): Promise<string> {
    return "OK";
  }
}
