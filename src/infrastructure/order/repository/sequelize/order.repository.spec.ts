import { Sequelize } from "sequelize-typescript";
import Address from "../../../../domain/customer/value-object/address";
import Customer from "../../../../domain/customer/entity/customer";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import ProductModel from "../../../product/repository/sequelize/product.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import OrderRepository from "./order.repository";
import ProductRepository from "../../../product/repository/sequelize/product.repository";

describe("Order repository tests", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });
    sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a order", async () => {
    const customerRepository = new CustomerRepository();
    const address = new Address("Street 1", 1, "Zip 1", "City 1");
    const customer = new Customer("c1", "Customer 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("p1", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "i1",
      product.id,
      product.name,
      product.price,
      2
    );
    const order = new Order("o1", customer.id, [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);
    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });
    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: customer.id,
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: order.id,
          product_id: orderItem.productId,
        },
      ],
    });
  });

  it("should update a product in a order item", async () => {
    const customerRepository = new CustomerRepository();
    const address = new Address("Street 1", 1, "Zip 1", "City 1");
    const customer = new Customer("c1", "Customer 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("p1", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "i1",
      product.id,
      product.name,
      product.price,
      2
    );
    const order = new Order("o1", customer.id, [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const newProduct = new Product("p2", "Product 2", 20);
    await productRepository.create(newProduct);

    const updatedOrderItem = new OrderItem(
      "i1",
      newProduct.id,
      newProduct.name,
      newProduct.price,
      3
    );
    const updatedOrder = new Order("o1", customer.id, [updatedOrderItem]);
    await orderRepository.update(updatedOrder);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: customer.id,
      total: updatedOrder.total(),
      items: [
        {
          id: updatedOrderItem.id,
          name: updatedOrderItem.name,
          price: updatedOrderItem.price,
          quantity: updatedOrderItem.quantity,
          order_id: order.id,
          product_id: updatedOrderItem.productId,
        },
      ],
    });
  });

  it("should find a order", async () => {
    const customerRepository = new CustomerRepository();
    const address = new Address("Street 1", 1, "Zip 1", "City 1");
    const customer = new Customer("c1", "Customer 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("p1", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "i1",
      product.id,
      product.name,
      product.price,
      2
    );
    const order = new Order("o1", customer.id, [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const foundOrder = await orderRepository.find(order.id);
    expect(foundOrder).toStrictEqual(order);
  });

  it("should find all orders", async () => {
    const customerRepository = new CustomerRepository();
    const address = new Address("Street 1", 1, "Zip 1", "City 1");
    const customer = new Customer("c1", "Customer 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("p1", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "i1",
      product.id,
      product.name,
      product.price,
      2
    );

    const order1 = new Order("o1", customer.id, [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order1);

    const newOrderItem = new OrderItem(
      "i2",
      product.id,
      product.name,
      product.price,
      2
    );

    const order2 = new Order("o2", customer.id, [newOrderItem]);
    await orderRepository.create(order2);

    const foundOrders = await orderRepository.findAll();
    const orders = [order1, order2];
    expect(foundOrders).toStrictEqual(orders);
  });
});
