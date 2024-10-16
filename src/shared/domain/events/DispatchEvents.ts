import { DomainEvents } from "./DomainEvents";
import { UniqueEntityID } from "../UniqueEntityID";

export const dispatchEventsCallback = (primaryKeyField: string | null) => {
  if (primaryKeyField !== null) {
    const aggregateId = new UniqueEntityID(primaryKeyField);
    DomainEvents.dispatchEventsForAggregate(aggregateId);
  }
};