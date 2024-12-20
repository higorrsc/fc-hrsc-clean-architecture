import Product from "./product";

describe("Product unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      const product = new Product("", "Product 1", 100);
    }).toThrow("product: Id is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => {
      const product = new Product("1", "", 100);
    }).toThrow("product: Name is required");
  });

  it("should throw error when price is less than 0", () => {
    expect(() => {
      const product = new Product("1", "Product 1", -1);
    }).toThrow("Price must be greater than zero");
  });

  // teste que acumule dois erros ao mesmo tempo em Product.
  // juntando o erro de Id e Name como campos obrigatórios
  it("should throw error when id and name are empty", () => {
    expect(() => {
      const product = new Product("", "", 1);
    }).toThrow("product: Id is required,product: Name is required");
  });

  it("should change name", () => {
    let product = new Product("1", "Product 1", 100);
    product.changeName("Product 2");
    expect(product.name).toBe("Product 2");
  });

  it("should change price", () => {
    let product = new Product("1", "Product 1", 100);
    product.changePrice(200);
    expect(product.price).toBe(200);
  });
});
