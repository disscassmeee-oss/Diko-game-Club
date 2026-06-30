import {
  Entity,
  PrimaryColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity('settings')
export class Settings {
  @PrimaryColumn()
  id: string;

  @Column({ default: 'Diko Game Club' })
  cafeTitle: string;

  @Column({ default: 'UZS' })
  currency: string;

  @Column({ default: 'Asia/Tashkent' })
  timezone: string;

  @Column({ default: false })
  maintenanceMode: boolean;

  @Column({ default: 30 })
  autoLogoutTime: number;

  @Column({ default: 100 })
  maxSessions: number;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
