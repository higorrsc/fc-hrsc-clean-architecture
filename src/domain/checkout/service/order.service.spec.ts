import Customer from "../../customer/entity/customer";
import Order from "../entity/order";
import OrderItem from "../entity/order_item";
import OrderService from "./order.service";

describe("Order service unit tests", () => {
  it("should calculate total of all orders", () => {
    const order1 = new Order("1", "1", [
      new OrderItem("1", "p1", "Item 1", 10, 1),
      new OrderItem("1", "p1", "Item 1", 20, 2),
    ]);

    const order2 = new Order("2", "2", [
      new OrderItem("2", "p2", "Item 2", 10, 1),
      new OrderItem("2", "p2", "Item 2", 20, 2),
    ]);

    const orders = [order1, order2];

    expect(OrderService.total(orders)).toBe(100);
  });

  it("should place an order", () => {
    const customer = new Customer("1", "Customer 1");
    const item1 = new OrderItem("1", "p1", "Item 1", 10, 1);
    const order = OrderService.placeOrder(customer, [item1]);
    expect(customer.rewardPoints).toBe(5);
    expect(order.total()).toBe(10);
  });
});
