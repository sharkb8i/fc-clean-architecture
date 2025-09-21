import Notification from "../notification/notification";
import EntityInterface from "./entity.interface";

export default abstract class Entity implements EntityInterface {
  protected _id: string;
  public notification: Notification;

  constructor() {
    this.notification = new Notification();
  }

  get id(): string {
    return this._id;
  }
}