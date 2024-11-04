import OrderItem from "./order_item";

describe("Order Item unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      let orderItem = new OrderItem("", "p1", "Item 1", 10, 1);
    }).toThrow("Id is required");
  });

  it("should throw error when product id is empty", () => {
    expect(() => {
      let orderItem = new OrderItem("1", "", "Item 1", 10, 1);
    }).toThrow("ProductId is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => {
      let orderItem = new OrderItem("1", "p1", "", 10, 1);
    }).toThrow("Name is required");
  });

  it("should throw error when price is less than zero", () => {
    expect(() => {
      let orderItem = new OrderItem("1", "p1", "Item 1", -1, 1);
    }).toThrow("Price must be greater than zero");
  });

  it("should throw error when quantity is less than zero", () => {
    expect(() => {
      let orderItem = new OrderItem("1", "p1", "Item 1", 10, -1);
    }).toThrow("Quantity must be greater than zero");
  });
});
