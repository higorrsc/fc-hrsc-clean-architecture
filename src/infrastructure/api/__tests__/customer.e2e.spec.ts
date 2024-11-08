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
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("John Doe");
    expect(response.body.address.street).toBe("Street 1");
    expect(response.body.address.number).toBe(1);
    expect(response.body.address.zip).toBe("Zip 1");
    expect(response.body.address.city).toBe("City 1");
  });

  it("should not create a customer", async () => {
    const response = await request(app).post("/customer").send({
      name: "John Doe",
    });
    expect(response.status).toBe(500);
  });

  it("should list all customers", async () => {
    const responseJohn = await request(app)
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
    expect(responseJohn.status).toBe(200);
    const responseJane = await request(app)
      .post("/customer")
      .send({
        name: "Jane Doe",
        address: {
          street: "Street 2",
          number: 2,
          zip: "Zip 2",
          city: "City 2",
        },
      });
    expect(responseJane.status).toBe(200);

    const listResponse = await request(app).get("/customer").send();
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.customers).toHaveLength(2);
    const [john, jane] = listResponse.body.customers;
    expect(john.name).toBe("John Doe");
    expect(john.address.street).toBe("Street 1");
    expect(john.address.number).toBe(1);
    expect(john.address.zip).toBe("Zip 1");
    expect(john.address.city).toBe("City 1");
    expect(jane.name).toBe("Jane Doe");
    expect(jane.address.street).toBe("Street 2");
    expect(jane.address.number).toBe(2);
    expect(jane.address.zip).toBe("Zip 2");
    expect(jane.address.city).toBe("City 2");
  });
});
