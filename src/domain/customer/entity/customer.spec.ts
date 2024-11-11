import Address from "../value-object/address";
import Customer from "./customer";

describe("Customer unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      let customer = new Customer("", "John");
    }).toThrow("customer: Id is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => {
      let customer = new Customer("1", "");
    }).toThrow("customer: Name is required");
  });

  it("should throw error when name and id are empty", () => {
    expect(() => {
      let customer = new Customer("", "");
    }).toThrow("customer: Id is required,customer: Name is required");
  });

  it("should change name", () => {
    let customer = new Customer("123", "John");
    customer.changeName("Higor");
    expect(customer.name).toBe("Higor");
  });

  it("should activate customer", () => {
    const customer = new Customer("1", "Higor");
    const address = new Address("Street", 123, "Zip", "City");
    customer.Address = address;
    customer.activate();
    expect(customer.isActive()).toBe(true);
  });

  it("should throw error when address is undefined when activate a customer", () => {
    expect(() => {
      const customer = new Customer("1", "Higor");
      customer.activate();
    }).toThrow("Address is mandatory to activate a customer");
  });

  it("should deactivate customer", () => {
    const customer = new Customer("1", "Higor");
    customer.deactivate();
    expect(customer.isActive()).toBe(false);
  });

  it("should add reward points", () => {
    const customer = new Customer("1", "Higor");
    expect(customer.rewardPoints).toBe(0);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(10);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(20);
  });
});
