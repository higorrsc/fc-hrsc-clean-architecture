import request from "supertest";
import { app, sequelize } from "../express";

describe("Product API E2E tests", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const response = await request(app).post("/product").send({
      id: "p1",
      name: "Product 1",
      price: 10,
    });
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Product 1");
    expect(response.body.price).toBe(10);
  });

  it("should not create a product", async () => {
    const response = await request(app).post("/product").send({
      id: "p1",
      name: "Product 1",
      price: -1,
    });
    expect(response.status).toBe(500);
  });

  it("should list all products", async () => {
    const response = await request(app).post("/product").send({
      id: "p1",
      name: "Product 1",
      price: 10,
    });
    expect(response.status).toBe(200);
    const response2 = await request(app).post("/product").send({
      id: "p2",
      name: "Product 2",
      price: 20,
    });
    expect(response2.status).toBe(200);
    const listResponse = await request(app).get("/product").send();
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.products).toHaveLength(2);
    expect(listResponse.body.products[0].name).toBe("Product 1");
    expect(listResponse.body.products[0].price).toBe(10);
    expect(listResponse.body.products[1].name).toBe("Product 2");
  });
});
