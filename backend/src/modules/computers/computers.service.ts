import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Computer } from './entities/computer.entity';
import { CreateComputerDto } from './dto/create-computer.dto';
import { UpdateComputerDto } from './dto/update-computer.dto';

@Injectable()
export class ComputersService {
  constructor(
    @InjectRepository(Computer)
    private computersRepository: Repository<Computer>,
  ) {}

  async create(createComputerDto: CreateComputerDto) {
    const computer = this.computersRepository.create(createComputerDto);
    return this.computersRepository.save(computer);
  }

  async findAll() {
    return this.computersRepository.find();
  }

  async findById(id: string) {
    const computer = await this.computersRepository.findOne({ where: { id } });
    if (!computer) {
      throw new NotFoundException('Computer not found');
    }
    return computer;
  }

  async update(id: string, updateComputerDto: UpdateComputerDto) {
    await this.computersRepository.update(id, updateComputerDto);
    return this.findById(id);
  }

  async updateStatus(id: string, status: string) {
    await this.computersRepository.update(id, { status });
    return this.findById(id);
  }

  async remove(id: string) {
    const computer = await this.findById(id);
    await this.computersRepository.remove(computer);
  }

  async setMacAddress(id: string, macAddress: string) {
    await this.computersRepository.update(id, { macAddress });
    return this.findById(id);
  }
}
