export interface Notifier {
  channel: string;
  send(message: string): Promise<void>;
}
