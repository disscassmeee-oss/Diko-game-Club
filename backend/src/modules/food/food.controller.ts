import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { FoodService } from './food.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateFoodMenuDto } from './dto/create-food-menu.dto';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('food')
@UseGuards(JwtAuthGuard)
export class FoodController {
  constructor(private foodService: FoodService) {}

  @Post('menu')
  createMenuItem(@Body() createFoodMenuDto: CreateFoodMenuDto) {
    return this.foodService.createMenuItem(createFoodMenuDto);
  }

  @Get('menu')
  getMenuItems() {
    return this.foodService.getMenuItems();
  }

  @Get('menu/:id')
  getMenuItem(@Param('id') id: string) {
    return this.foodService.getMenuItem(id);
  }

  @Patch('menu/:id')
  updateMenuItem(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateFoodMenuDto>,
  ) {
    return this.foodService.updateMenuItem(id, updateData);
  }

  @Delete('menu/:id')
  @HttpCode(204)
  deleteMenuItem(@Param('id') id: string) {
    return this.foodService.deleteMenuItem(id);
  }

  @Post('order')
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.foodService.createOrder(createOrderDto);
  }

  @Get('order')
  getOrders() {
    return this.foodService.getOrders();
  }

  @Get('order/:id')
  getOrder(@Param('id') id: string) {
    return this.foodService.getOrderWithItems(id);
  }

  @Patch('order/:id/status')
  updateOrderStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.foodService.updateOrderStatus(id, body.status);
  }

  @Get('order/computer/:computerId')
  getComputerOrders(@Param('computerId') computerId: string) {
    return this.foodService.getOrdersByComputer(computerId);
  }
}
