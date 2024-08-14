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
import { catchError } from "rxjs";

import { CreateOrderDto, OrderPaginationDto, StatusDto } from "./dto";
import { PaginationDto } from "../common";

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
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.ordersClient.send("findAllOrders", orderPaginationDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      })
    );
  }

  @Get(":status")
  findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto
  ) {
    return this.ordersClient
      .send("findAllOrders", {
        ...paginationDto,
        status: statusDto.status,
      })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        })
      );
  }

  @Get("id/:id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.ordersClient.send("findOneOrder", { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      })
    );
  }

  @Patch(":id")
  changeOrderStatus(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto
  ) {
    return this.ordersClient
      .send("changeOrderStatus", { id, status: statusDto.status })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        })
      );
  }
}
