import { Entity } from "./Entity";
import { DomainEvents } from "./events/DomainEvents";
import { IDomainEvent } from "./events/IDomainEvent";
import { UniqueEntityID } from "./UniqueEntityID";

export abstract class AggregateRoot<T> extends Entity<T> {
  private _domainEvents: IDomainEvent[] = [];

  get id(): UniqueEntityID {
    return this._id;
  }

  get domainEvents(): IDomainEvent[] {
    return this._domainEvents;
  }

  public addDomainEvent(domainEvent: IDomainEvent): void {
    // Add the domain event to this aggregate's list of domain events
    this._domainEvents.push(domainEvent);
    // Add this aggregate instance to the domain event's list of aggregates who's
    // events it eventually needs to dispatch.
    DomainEvents.markAggregateForDispatch(this);
  }

  public clearEvents(): void {
    this._domainEvents.splice(0, this._domainEvents.length);
  }

  // protected dispatchDomainEvent(domainEvent: IDomainEvent): void {
  //   EventService.dispatch(domainEvent);
  //   console.info(`[Domain Event Created]:`, domainEvent.name);
  // }
}
