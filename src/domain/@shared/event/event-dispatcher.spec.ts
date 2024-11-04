import CustomerAddressChangedEvent from "../../customer/event/customer-address-changed.event";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import SendConsoleLog1WhenCustomerIsCreatedHandler from "../../customer/event/handler/send-console-log-1-when-customer-is-created.handler";
import SendConsoleLog2WhenCustomerIsCreatedHandler from "../../customer/event/handler/send-console-log-2-when-customer-is-created.handler";
import SendConsoleLogWhenCustomerAddressIsChangedHandler from "../../customer/event/handler/send-console-log-when-customer-address-is-changed.handler";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const eventName = "ProductCreatedEvent";

    eventDispatcher.register(eventName, eventHandler);

    expect(eventDispatcher.getEventHandlers[eventName]).toBeDefined();
    expect(eventDispatcher.getEventHandlers[eventName].length).toBe(1);
    expect(eventDispatcher.getEventHandlers[eventName][0]).toMatchObject(
      eventHandler
    );
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const eventName = "ProductCreatedEvent";

    eventDispatcher.register(eventName, eventHandler);
    expect(eventDispatcher.getEventHandlers[eventName][0]).toMatchObject(
      eventHandler
    );

    eventDispatcher.unregister(eventName, eventHandler);
    expect(eventDispatcher.getEventHandlers[eventName].length).toBe(0);
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const eventName = "ProductCreatedEvent";

    eventDispatcher.register(eventName, eventHandler);
    expect(eventDispatcher.getEventHandlers[eventName][0]).toMatchObject(
      eventHandler
    );

    eventDispatcher.unregisterAll();
    expect(eventDispatcher.getEventHandlers[eventName]).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const eventName = "ProductCreatedEvent";

    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register(eventName, eventHandler);
    expect(eventDispatcher.getEventHandlers[eventName][0]).toMatchObject(
      eventHandler
    );

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    eventDispatcher.notify(productCreatedEvent);
    expect(spyEventHandler).toHaveBeenCalled();
  });
});

describe("Customer domain events unit tests", () => {
  it("should notify when a customer is created", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new SendConsoleLog1WhenCustomerIsCreatedHandler();
    const eventHandler2 = new SendConsoleLog2WhenCustomerIsCreatedHandler();
    const eventName = "CustomerCreatedEvent";

    const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
    eventDispatcher.register(eventName, eventHandler1);

    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");
    eventDispatcher.register(eventName, eventHandler2);

    expect(eventDispatcher.getEventHandlers[eventName][0]).toMatchObject(
      eventHandler1
    );
    expect(eventDispatcher.getEventHandlers[eventName][1]).toMatchObject(
      eventHandler2
    );

    const customerCreateEvent = new CustomerCreatedEvent({
      id: "1",
      name: "Customer 1",
      address: {
        street: "Street 1",
        number: 1,
        zip: "Zip 1",
        city: "City 1",
      },
    });

    eventDispatcher.notify(customerCreateEvent);
    expect(spyEventHandler1).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();
  });

  it("should notify when a customer address is changed", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler =
      new SendConsoleLogWhenCustomerAddressIsChangedHandler();
    const eventName = "CustomerAddressChangedEvent";

    const spyEventHandler = jest.spyOn(eventHandler, "handle");
    eventDispatcher.register(eventName, eventHandler);

    expect(eventDispatcher.getEventHandlers[eventName][0]).toMatchObject(
      eventHandler
    );

    const customerAddressChanged = new CustomerAddressChangedEvent({
      id: "1",
      name: "Customer 1",
      address: {
        street: "Street 1",
        number: 1,
        zip: "Zip 1",
        city: "City 1",
      },
    });
    eventDispatcher.notify(customerAddressChanged);
    expect(spyEventHandler).toHaveBeenCalled();
  });
});
