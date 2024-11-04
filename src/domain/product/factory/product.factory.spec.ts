import ProductFactory from "./product.factory";

describe("Product factory unit tests", () => {
  it("should create a product type A", () => {
    const product = ProductFactory.create("a", "Product 1", 10);
    expect(product.id).toBeDefined();
    expect(product.name).toBe("Product 1");
    expect(product.price).toBe(10);
    expect(product.constructor.name).toBe("Product");
  });

  it("should create a product type B", () => {
    const product = ProductFactory.create("b", "Product 2", 10);
    expect(product.id).toBeDefined();
    expect(product.name).toBe("Product 2");
    expect(product.price).toBe(20);
    expect(product.constructor.name).toBe("ProductB");
  });

  it("should throw an error when type is not supported", () => {
    expect(() => {
      ProductFactory.create("c", "Product 3", 10);
    }).toThrow("Product type not supported");
  });
});
