import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import UpdateProductUseCase from "./update.product.usecase";

describe("Update product integration tests", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });
    sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should update a product", async () => {
    const product = new Product("123", "Product 1", 10);
    const productRepository = new ProductRepository();
    productRepository.create(product);
    const useCase = new UpdateProductUseCase(productRepository);

    const input = {
      id: "123",
      name: "Product 1 Alter",
      price: 20,
    };

    const output = await useCase.execute(input);
    expect(output).toEqual(input);
  });
});
