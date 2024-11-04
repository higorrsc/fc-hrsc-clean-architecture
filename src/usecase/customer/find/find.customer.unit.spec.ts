import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import FindCustomerUseCase from "./find.customer.usecase";

const customer = new Customer("123", "John Doe");
const address = new Address("street", 123, "zip", "City");
customer.changeAddress(address);

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(customer)),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit test find customer use case", () => {
  it("should find a customer", async () => {
    const customerRepository = MockRepository();

    const useCase = new FindCustomerUseCase(customerRepository);

    const input = { id: customer.id };

    const output = {
      id: customer.id,
      name: customer.name,
      address: {
        street: customer.address.street,
        number: customer.address.number,
        zip: customer.address.zip,
        city: customer.address.city,
      },
    };

    const result = await useCase.execute(input);
    expect(result).toEqual(output);
  });
});
