import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerAddressChangedEvent from "../customer-address-changed.event";

export default class SendConsoleLogWhenCustomerAddressIsChangedHandler
  implements EventHandlerInterface
{
  handle(event: CustomerAddressChangedEvent): void {
    console.log("Endereço do cliente: {id}, {nome} alterado para: {endereço}");
  }
}
