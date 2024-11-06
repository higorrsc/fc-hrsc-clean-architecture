import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import FindProductUseCase from "./find.product.usecase";

describe("Find product integration tests", () => {
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

  it("should find a product", async () => {
    const product = new Product("123", "Product 1", 10);
    const productRepository = new ProductRepository();
    productRepository.create(product);

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
});
