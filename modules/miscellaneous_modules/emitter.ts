/* eslint-disable @typescript-eslint/no-explicit-any*/

export type EventHandler<T = any> = (event: T) => void;

export class Emitter<T extends string | number> {
  private readonly events: { [key in T]: EventHandler[] } = Object.create(null);

  public on(event: T, handler: EventHandler): void {
    (this.events[event] || (this.events[event] = [])).push(handler);
  }

  public off(event: T, handler: EventHandler): void {
    if (!this.events[event]) return;

    this.events[event].splice(this.events[event].indexOf(handler) >>> 0, 1);
  }

  public emit<K = any>(event: T, data: K): void {
    (this.events[event] || []).forEach((handler) => {
      handler(data);
    });
  }
}
