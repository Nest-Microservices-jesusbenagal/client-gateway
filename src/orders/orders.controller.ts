import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  Patch,
  ParseUUIDPipe,
} from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { catchError } from "rxjs";

import { CreateOrderDto } from "./dto/";

import { ORDER_SERVICE } from "../config";

@Controller("orders")
export class OrdersController {
  constructor(
    @Inject(ORDER_SERVICE) private readonly ordersClient: ClientProxy
  ) {}
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send("createOrder", createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersClient.send("findAllOrders", {});
  }

  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.ordersClient.send("findOneOrder", { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      })
    );
  }

  @Patch()
  changeOrderStatus() {
    return this.ordersClient.send("changeOrderStatus", {}).pipe(
      catchError((err) => {
        throw new RpcException(err);
      })
    );
  }
}
