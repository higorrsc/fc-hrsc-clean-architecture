import request from "supertest";
import { app, sequelize } from "../express";

describe("Customer API E2E tests", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a customer", async () => {
    const response = await request(app)
      .post("/customer")
      .send({
        name: "John Doe",
        address: {
          street: "Street 1",
          number: 1,
          zip: "Zip 1",
          city: "City 1",
        },
      });
    expect(response.status).toBe(201);
    // expect(response.body).toStrictEqual({
    //   id: expect.any(String),
    //   name: "John Doe",
    //   address: {
    //     street: "Street 1",
    //     number: 1,
    //     zip: "Zip 1",
    //     city: "City 1",
    //   },
    // });
    expect(response.body.name).toBe("John Doe");
    expect(response.body.address.street).toBe("Street 1");
    expect(response.body.address.number).toBe(1);
    expect(response.body.address.zip).toBe("Zip 1");
    expect(response.body.address.city).toBe("City 1");
  });
});
