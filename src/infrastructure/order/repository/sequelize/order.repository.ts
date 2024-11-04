import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel, as: "items" }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    await OrderModel.update(
      {
        customer_id: entity.customerId,
        total: entity.total(),
      },
      {
        where: {
          id: entity.id,
        },
      }
    );

    const existingItems = await OrderItemModel.findAll({
      where: {
        order_id: entity.id,
      },
    });

    for (const item of entity.items) {
      const existingItem = existingItems.find((i) => i.id === item.id);
      if (existingItem) {
        await OrderItemModel.update(
          {
            name: item.name,
            price: item.price,
            product_id: item.productId,
            quantity: item.quantity,
          },
          {
            where: {
              id: item.id,
            },
          }
        );
      } else {
        await OrderItemModel.create({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
          order_id: entity.id,
        });
      }
    }

    const deleteItems = existingItems.filter(
      (existingItem) =>
        !entity.items.some((item) => item.id === existingItem.id)
    );

    for (const item of deleteItems) {
      await OrderItemModel.destroy({
        where: {
          id: item.id,
        },
      });
    }
  }

  async find(id: string): Promise<Order> {
    let orderModel;
    let orderItems;
    try {
      orderModel = await OrderModel.findOne({
        where: {
          id,
        },
        rejectOnEmpty: true,
        include: ["items"],
      });
      orderItems = orderModel.items.map(
        (item) =>
          new OrderItem(
            item.id,
            item.product_id,
            item.name,
            item.price,
            item.quantity
          )
      );
    } catch (error) {
      throw new Error("Order not found");
    }
    return new Order(orderModel.id, orderModel.customer_id, orderItems);
  }

  async findAll(): Promise<Order[]> {
    const ordersModel = await OrderModel.findAll({
      include: ["items"],
    });
    return ordersModel.map((orderModel) => {
      const orderItems = orderModel.items.map((item) => {
        return new OrderItem(
          item.id,
          item.product_id,
          item.name,
          item.price,
          item.quantity
        );
      });
      return new Order(orderModel.id, orderModel.customer_id, orderItems);
    });
  }
}
