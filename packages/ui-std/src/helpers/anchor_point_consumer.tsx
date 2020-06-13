import { Emitter, EventHandler } from '@kira/std';
import { Vec2 } from '../vec_2';

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
    public vec_2: Vec2;
    private readonly event_emitter = new Emitter();
    private top: string;
    private left: string;

    constructor({ name, ref, left, top }: Configuration) {
      this.name = name;
      this.element_reference = ref;
      this.top = top ?? default_position;
      this.left = left ?? default_position;

      window.addEventListener('resize', this.handleWindowEvent.bind(this));
      window.addEventListener('scroll', this.handleWindowEvent.bind(this));

      this.vec_2 = this.calculate_position(this.top, this.left);
    }

    public onChange(fn: EventHandler<Vec2>): () => void {
      this.event_emitter.on(Events.Update, fn);

      return () => {
        this.event_emitter.off(Events.Update, fn);
      };
    }

    public destroy() {
      window.removeEventListener('resize', this.handleWindowEvent.bind(this));
      window.removeEventListener('scroll', this.handleWindowEvent.bind(this));
    }

    private handleWindowEvent() {
      this.vec_2 = this.calculate_position(this.top, this.left);
      this.event_emitter.emit(Events.Update, this.vec_2);
    }

    private calculate_position(top: string, left: string): Vec2 {
      const rect = this.element_reference.getBoundingClientRect();

      function return_percentage_of_anchor_point_str(str: string): number {
        const length = str.length - 1;

        const index = str.indexOf('x');

        if (index === -1) throw new Error('no x');

        return index / length;
      }

      const top_percentage = return_percentage_of_anchor_point_str(top);
      const left_percentage = return_percentage_of_anchor_point_str(left);
      const top_position = rect.y + window.scrollY + rect.height * top_percentage;
      const left_position = rect.x + rect.width * left_percentage;

      return new Vec2(left_position, top_position);
    }
  }

  export function add(configuration: Configuration) {
    if (list.has(configuration.name)) {
      throw new Error(`Tried to add ${configuration.name} twice`);
    }

    list.set(configuration.name, new Instance(configuration));

    notifier.emit(Events.Notify, configuration.name);
  }

  export function destroy(name: string) {
    if (!list.has(name)) {
      throw new Error(`Could not find an event with the name ${name}`);
    }

    const anchor_point_instance = list.get(name)!;

    anchor_point_instance.destroy();

    list.delete(name);
  }
}
