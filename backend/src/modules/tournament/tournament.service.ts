import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from './entities/tournament.entity';
import { TournamentParticipant } from './entities/tournament-participant.entity';
import { CreateTournamentDto } from './dto/create-tournament.dto';

@Injectable()
export class TournamentService {
  constructor(
    @InjectRepository(Tournament)
    private tournamentRepository: Repository<Tournament>,
    @InjectRepository(TournamentParticipant)
    private participantRepository: Repository<TournamentParticipant>,
  ) {}

  async create(createTournamentDto: CreateTournamentDto) {
    const tournament = this.tournamentRepository.create(createTournamentDto);
    return this.tournamentRepository.save(tournament);
  }

  async findAll() {
    return this.tournamentRepository.find();
  }

  async findById(id: string) {
    const tournament = await this.tournamentRepository.findOne({ where: { id } });
    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }
    return tournament;
  }

  async registerParticipant(tournamentId: string, customerId: string) {
    const tournament = await this.findById(tournamentId);

    const existingParticipant = await this.participantRepository.findOne({
      where: { tournamentId, customerId },
    });

    if (existingParticipant) {
      throw new BadRequestException('Already registered in this tournament');
    }

    const participant = this.participantRepository.create({
      tournamentId,
      customerId,
      status: 'registered',
    });

    return this.participantRepository.save(participant);
  }

  async getParticipants(tournamentId: string) {
    return this.participantRepository.find({ where: { tournamentId } });
  }

  async updateParticipantScore(participantId: string, score: number) {
    await this.participantRepository.update(participantId, { score });
    return this.participantRepository.findOne({ where: { id: participantId } });
  }

  async finalizeTournament(id: string) {
    const participants = await this.participantRepository.find({
      where: { tournamentId: id },
    });

    const sorted = participants.sort((a, b) => b.score - a.score);

    await this.tournamentRepository.update(id, {
      status: 'completed',
      firstPlace: sorted[0]?.customerId,
      secondPlace: sorted[1]?.customerId,
      thirdPlace: sorted[2]?.customerId,
    });

    return this.findById(id);
  }
}
