import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  computerId: string;

  @Column({ nullable: true })
  customerId: string;

  @Column()
  startTime: Date;

  @Column({ nullable: true })
  endTime: Date;

  @Column({ default: 'running' })
  status: string;

  @Column({ nullable: true })
  duration: number;

  @Column({ nullable: true })
  pausedAt: Date;

  @Column({ default: 0 })
  totalPausedTime: number;

  @Column({ nullable: true })
  billId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
