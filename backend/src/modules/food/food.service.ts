import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoodMenu } from './entities/food-menu.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateFoodMenuDto } from './dto/create-food-menu.dto';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class FoodService {
  constructor(
    @InjectRepository(FoodMenu)
    private foodMenuRepository: Repository<FoodMenu>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}

  async createMenuItem(createFoodMenuDto: CreateFoodMenuDto) {
    const menuItem = this.foodMenuRepository.create(createFoodMenuDto);
    return this.foodMenuRepository.save(menuItem);
  }

  async getMenuItems() {
    return this.foodMenuRepository.find({ where: { isAvailable: true } });
  }

  async getMenuItem(id: string) {
    const item = await this.foodMenuRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException('Menu item not found');
    }
    return item;
  }

  async updateMenuItem(id: string, updateData: Partial<CreateFoodMenuDto>) {
    await this.foodMenuRepository.update(id, updateData);
    return this.getMenuItem(id);
  }

  async deleteMenuItem(id: string) {
    const item = await this.getMenuItem(id);
    await this.foodMenuRepository.remove(item);
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    if (createOrderDto.items.length === 0) {
      throw new BadRequestException('Order must have at least one item');
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of createOrderDto.items) {
      const menuItem = await this.getMenuItem(item.foodMenuId);
      if (!menuItem.isAvailable) {
        throw new BadRequestException(`${menuItem.name} is not available`);
      }
      totalAmount += menuItem.price * item.quantity;
      orderItems.push({ foodMenuId: item.foodMenuId, quantity: item.quantity });
    }

    const order = this.orderRepository.create({
      customerId: createOrderDto.customerId,
      computerId: createOrderDto.computerId,
      totalAmount,
      status: 'pending',
    });

    const savedOrder = await this.orderRepository.save(order);

    for (const item of orderItems) {
      const orderItem = this.orderItemRepository.create({
        orderId: savedOrder.id,
        ...item,
      });
      await this.orderItemRepository.save(orderItem);
    }

    return this.getOrderWithItems(savedOrder.id);
  }

  async getOrderWithItems(id: string) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const items = await this.orderItemRepository.find({ where: { orderId: id } });
    return { ...order, items };
  }

  async updateOrderStatus(id: string, status: string) {
    await this.orderRepository.update(id, { status });
    return this.getOrderWithItems(id);
  }

  async getOrders() {
    return this.orderRepository.find({ relations: ['items'] });
  }

  async getOrdersByComputer(computerId: string) {
    return this.orderRepository.find({ where: { computerId } });
  }

  async reduceInventory(foodMenuId: string, quantity: number) {
    const item = await this.getMenuItem(foodMenuId);
    if (item.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }
    await this.foodMenuRepository.update(foodMenuId, {
      stock: item.stock - quantity,
    });
  }
}
