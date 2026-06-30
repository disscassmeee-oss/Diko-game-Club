import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('remote_commands')
export class RemoteCommand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  computerId: string;

  @Column()
  command: string;

  @Column()
  targetIp: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ nullable: true })
  errorMessage: string;

  @Column({ nullable: true })
  completedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
