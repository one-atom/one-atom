import { Vec2, Emitter, EventHandler } from '../../miscellaneous_modules/mod';

export namespace AnchorPointConsumer {
  interface Configuration {
    name: string;
    ref: HTMLElement;
    top?: string;
    left?: string;
  }

  export enum Events {
    Update,
    Notify,
  }

  const default_position = 'x-';
  export const list = new Map<string, Instance>();
  export const notifier = new Emitter();

  class Instance {
    public readonly name: string;
    public readonly element_reference: HTMLElement;
    public vec2: Vec2;
    private readonly event_emitter = new Emitter();
    private top: string;
    private left: string;

    constructor({ name, ref, left, top }: Configuration) {
      this.name = name;
      this.element_reference = ref;
      this.top = top ?? default_position;
      this.left = left ?? default_position;

      globalThis.addEventListener('resize', this.handleWindowEvent.bind(this));
      globalThis.addEventListener('scroll', this.handleWindowEvent.bind(this));

      this.vec2 = this.calculatePosition(this.top, this.left);
    }

    public onChange(fn: EventHandler<Vec2>): () => void {
      this.event_emitter.on(Events.Update, fn);

      return () => {
        this.event_emitter.off(Events.Update, fn);
      };
    }

    public destroy(): void {
      globalThis.removeEventListener('resize', this.handleWindowEvent.bind(this));
      globalThis.removeEventListener('scroll', this.handleWindowEvent.bind(this));
    }

    private handleWindowEvent(): void {
      this.vec2 = this.calculatePosition(this.top, this.left);
      this.event_emitter.emit(Events.Update, this.vec2);
    }

    private calculatePosition(top: string, left: string): Vec2 {
      const rect = this.element_reference.getBoundingClientRect();

      function return_percentage_of_anchor_point_str(str: string): number {
        const length = str.length - 1;

        const index = str.indexOf('x');

        if (index === -1) throw new Error('no x');

        return index / length;
      }

      const top_percentage = return_percentage_of_anchor_point_str(top);
      const left_percentage = return_percentage_of_anchor_point_str(left);
      const top_position = rect.y + globalThis.scrollY + rect.height * top_percentage;
      const left_position = rect.x + rect.width * left_percentage;

      return new Vec2(left_position, top_position);
    }
  }

  export function add(configuration: Configuration): void {
    if (list.has(configuration.name)) {
      throw new Error(`Tried to add ${configuration.name} twice`);
    }

    list.set(configuration.name, new Instance(configuration));

    notifier.emit(Events.Notify, configuration.name);
  }

  export function destroy(name: string): void {
    const anchor_point_instance = list.get(name);
    if (anchor_point_instance === undefined) throw new Error(`Could not find an event with the name ${name}`);

    anchor_point_instance.destroy();

    list.delete(name);
  }
}
