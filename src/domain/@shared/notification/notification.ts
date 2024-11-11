export type NotificationError = {
  message: string;
  context: string;
};

export default class Notification {
  private errors: NotificationError[] = [];

  addError(error: NotificationError) {
    this.errors.push(error);
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  messages(context?: string): string {
    let message = "";
    this.errors.forEach((error) => {
      if (error.context === context || !context) {
        message += `${error.context}: ${error.message},`;
      }
    });
    return message;
  }
}
