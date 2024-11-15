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

    const listResponseXML = await request(app)
      .get("/customer")
      .set("Accept", "application/xml")
      .send();
    expect(listResponseXML.status).toBe(200);
    expect(listResponseXML.text).toContain(
      '<?xml version="1.0" encoding="UTF-8"?>'
    );
    expect(listResponseXML.text).toContain("<customers>");
    expect(listResponseXML.text).toContain("<customer>");
    expect(listResponseXML.text).toContain("<name>John Doe</name>");
    expect(listResponseXML.text).toContain("<address>");
    expect(listResponseXML.text).toContain("<street>Street 1</street>");
    expect(listResponseXML.text).toContain("<number>1</number>");
    expect(listResponseXML.text).toContain("<zip>Zip 1</zip>");
    expect(listResponseXML.text).toContain("<city>City 1</city>");
    expect(listResponseXML.text).toContain("</address>");
    expect(listResponseXML.text).toContain("</customer>");
    expect(listResponseXML.text).toContain("<name>Jane Doe</name>");
    expect(listResponseXML.text).toContain("<street>Street 2</street>");
    expect(listResponseXML.text).toContain("<number>2</number>");
    expect(listResponseXML.text).toContain("<zip>Zip 2</zip>");
    expect(listResponseXML.text).toContain("<city>City 2</city>");
    expect(listResponseXML.text).toContain("</customers>");
  });
});
