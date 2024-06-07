import { Controller, Get } from '@nestjs/common';

@Controller()
export class HomeController {

    @Get()
    getHome(): string {
        return 'Rocket red test task API'
    }
}
