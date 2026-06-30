import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ComputersService } from './computers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateComputerDto } from './dto/create-computer.dto';
import { UpdateComputerDto } from './dto/update-computer.dto';

@Controller('computers')
@UseGuards(JwtAuthGuard)
export class ComputersController {
  constructor(private computersService: ComputersService) {}

  @Post()
  create(@Body() createComputerDto: CreateComputerDto) {
    return this.computersService.create(createComputerDto);
  }

  @Get()
  findAll() {
    return this.computersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.computersService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateComputerDto: UpdateComputerDto) {
    return this.computersService.update(id, updateComputerDto);
  }

  @Patch(':id/mac-address')
  setMacAddress(@Param('id') id: string, @Body() body: { macAddress: string }) {
    return this.computersService.setMacAddress(id, body.macAddress);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.computersService.remove(id);
  }
}
