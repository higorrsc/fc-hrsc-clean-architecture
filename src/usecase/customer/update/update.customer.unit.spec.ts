import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import UpdateCustomerUseCase from "./update.customer.usecase";

const customer = CustomerFactory.createWithAddress(
  "Higor",
  new Address("Street", 123, "Zip", "City")
);

const input = {
  id: customer.id,
  name: "Higor Rodrigues",
  address: {
    street: "Street Nova",
    number: 1234,
    zip: "Zip Novo",
    city: "City Nova",
  },
};

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(customer)),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit test customer update use case", () => {
  it("should update a customer", async () => {
    const customerRepository = MockRepository();
    const useCase = new UpdateCustomerUseCase(customerRepository);

    const output = await useCase.execute(input);
    expect(output).toEqual(input);
  });
});
