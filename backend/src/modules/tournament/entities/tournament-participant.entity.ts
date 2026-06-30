import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('tournament_participants')
export class TournamentParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tournamentId: string;

  @Column()
  customerId: string;

  @Column({ default: 0 })
  score: number;

  @Column({ default: 'registered' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
