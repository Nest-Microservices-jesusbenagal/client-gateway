import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  Patch,
  ParseUUIDPipe,
  Query,
} from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

import { CreateOrderDto, OrderPaginationDto, StatusDto } from "./dto";
import { PaginationDto } from "../common";

import { NATS_SERVICE } from "../config";

@Controller("orders")
export class OrdersController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send("createOrder", createOrderDto);
  }

  @Get()
  async findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    try {
      const orders = await firstValueFrom(
        this.client.send("findAllOrders", orderPaginationDto)
      );

      return orders;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(":status")
  async findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto
  ) {
    try {
      const orders = await firstValueFrom(
        this.client.send("findAllOrdersByStatus", {
          status: statusDto.status,
          ...paginationDto,
        })
      );

      return orders;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get("id/:id")
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    try {
      const order = await firstValueFrom(this.client.send("findOneOrder", id));

      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(":id")
  async changeOrderStatus(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto
  ) {
    try {
      const order = await firstValueFrom(
        this.client.send("changeOrderStatus", {
          id,
          status: statusDto.status,
        })
      );

      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
