import FindProductUseCase from "./find.product.usecase";

const product = {
  id: "123",
  name: "Product 1",
  price: 10,
};

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit test find product use case", () => {
  it("should find a product", async () => {
    const productRepository = MockRepository();
    const useCase = new FindProductUseCase(productRepository);

    const input = { id: product.id };

    const output = {
      id: product.id,
      name: product.name,
      price: product.price,
    };

    const result = await useCase.execute(input);
    expect(result).toEqual(output);
  });

  it("should not find a product", async () => {
    const productRepository = MockRepository();
    productRepository.find.mockImplementation(() => {
      throw new Error("Product not found");
    });
    const useCase = new FindProductUseCase(productRepository);

    const input = { id: "abc" };

    expect(() => {
      return useCase.execute(input);
    }).rejects.toThrow("Product not found");
  });
});
