import EntityInterface from "../../@shared/entity/entity.interface";

export default interface ProductInterface extends EntityInterface{
  get id(): string;
  get name(): string;
  get price(): number;

  changeName(name: string): void;
  changePrice(price: number): void;
}