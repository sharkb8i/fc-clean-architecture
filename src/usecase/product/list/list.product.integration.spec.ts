import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ListProductUseCase from "./list.product.usecase";

describe("Test list customer use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should list products", async () => {
    const productRepository = new ProductRepository();
    const usecase = new ListProductUseCase(productRepository);

    const productA = new Product("123", "Product A", 25.25);
    await productRepository.create(productA);

    const productB = new Product("321", "Product B", 50.50);
    await productRepository.create(productB);

    const result = await usecase.execute({});

    expect(result.products.length).toBe(2);
    expect(result.products[0].id).toBe(productA.id);
    expect(result.products[0].name).toBe(productA.name);
    expect(result.products[0].price).toBe(productA.price);
    expect(result.products[1].id).toBe(productB.id);
    expect(result.products[1].name).toBe(productB.name);
    expect(result.products[1].price).toBe(productB.price);
  });
});