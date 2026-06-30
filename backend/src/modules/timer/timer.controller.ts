import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { TimerService } from './timer.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSessionDto } from './dto/create-session.dto';

@Controller('timer')
@UseGuards(JwtAuthGuard)
export class TimerController {
  constructor(private timerService: TimerService) {}

  @Post('start')
  startSession(@Body() createSessionDto: CreateSessionDto) {
    return this.timerService.startSession(createSessionDto);
  }

  @Post(':id/stop')
  @HttpCode(200)
  stopSession(@Param('id') id: string) {
    return this.timerService.stopSession(id);
  }

  @Post(':id/pause')
  @HttpCode(200)
  pauseSession(@Param('id') id: string) {
    return this.timerService.pauseSession(id);
  }

  @Post(':id/resume')
  @HttpCode(200)
  resumeSession(@Param('id') id: string) {
    return this.timerService.resumeSession(id);
  }

  @Get(':id')
  getSession(@Param('id') id: string) {
    return this.timerService.findSession(id);
  }

  @Get('computer/:computerId')
  getComputerSession(@Param('computerId') computerId: string) {
    return this.timerService.findByComputerId(computerId);
  }

  @Get()
  getAllSessions() {
    return this.timerService.findAll();
  }
}
