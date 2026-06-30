import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Settings } from './entities/settings.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Settings)
    private settingsRepository: Repository<Settings>,
  ) {}

  async getSettings() {
    let settings = await this.settingsRepository.findOne({ where: { id: '1' } });
    if (!settings) {
      settings = await this.createDefaultSettings();
    }
    return settings;
  }

  private async createDefaultSettings() {
    const settings = this.settingsRepository.create({
      id: '1',
      cafeTitle: 'Diko Game Club',
      currency: 'UZS',
      timezone: 'Asia/Tashkent',
      maintenanceMode: false,
      autoLogoutTime: 30,
      maxSessions: 100,
    });
    return this.settingsRepository.save(settings);
  }

  async updateSettings(updateData: Partial<Settings>) {
    let settings = await this.getSettings();
    settings = this.settingsRepository.merge(settings, updateData);
    return this.settingsRepository.save(settings);
  }
}
