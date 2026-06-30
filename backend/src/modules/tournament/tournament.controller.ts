import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTournamentDto } from './dto/create-tournament.dto';

@Controller('tournaments')
@UseGuards(JwtAuthGuard)
export class TournamentController {
  constructor(private tournamentService: TournamentService) {}

  @Post()
  create(@Body() createTournamentDto: CreateTournamentDto) {
    return this.tournamentService.create(createTournamentDto);
  }

  @Get()
  findAll() {
    return this.tournamentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tournamentService.findById(id);
  }

  @Post(':id/register')
  @HttpCode(201)
  registerParticipant(
    @Param('id') id: string,
    @Body() body: { customerId: string },
  ) {
    return this.tournamentService.registerParticipant(id, body.customerId);
  }

  @Get(':id/participants')
  getParticipants(@Param('id') id: string) {
    return this.tournamentService.getParticipants(id);
  }

  @Patch(':id/finalize')
  finalizeTournament(@Param('id') id: string) {
    return this.tournamentService.finalizeTournament(id);
  }
}
