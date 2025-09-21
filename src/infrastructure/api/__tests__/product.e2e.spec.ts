import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        type: "a",
        name: "Product",
        price: 25.25
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Product");
    expect(response.body.price).toBe(25.25);
  });

  it("should not create a product", async () => {
    const response = await request(app).post("/product").send({
      name: "product",
    });
    expect(response.status).toBe(500);
  });

  it("should list all products", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        type: "a",
        name: "Product A",
        price: 25.25,
      });
    expect(response.status).toBe(200);

    const response2 = await request(app)
      .post("/product")
      .send({
        type: "b",
        name: "Product B",
        price: 50.50,
      });
    expect(response2.status).toBe(200);

    const listResponse = await request(app).get("/product").send();

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.products.length).toBe(2);

    const product1 = listResponse.body.products[0];
    expect(product1.name).toBe("Product A");

    const product2 = listResponse.body.products[1];
    expect(product2.name).toBe("Product B");

    const listResponseXML = await request(app)
      .get("/product")
      .set("Accept", "application/xml")
      .send();

    expect(listResponseXML.status).toBe(200);
    expect(listResponseXML.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
    expect(listResponseXML.text).toContain(`<products>`);
    expect(listResponseXML.text).toContain(`<product>`);
    expect(listResponseXML.text).toContain(`<name>Product A</name>`);
    expect(listResponseXML.text).toContain(`<price>25.25</price>`);
    expect(listResponseXML.text).toContain(`</product>`);
    expect(listResponseXML.text).toContain(`<product>`);
    expect(listResponseXML.text).toContain(`<name>Product B</name>`);
    expect(listResponseXML.text).toContain(`<price>50.5</price>`);
    expect(listResponseXML.text).toContain(`</products>`);    
  });
});
