import { useState, useEffect } from 'react';

type FormPrimitiveValue = string | number | boolean;

type FormValidator = (value: FormPrimitiveValue) => boolean;

interface FormControl<T extends FormPrimitiveValue> {
  initialValue: T;
  value: T;
  valid: boolean;
  touched: boolean;
  validators: FormValidator[];
}

type FormSpec<T, K extends FormPrimitiveValue> = {
  [key in keyof T]: FormControl<K>;
};

// @ts-ignore
type FormSubmitData<T extends FormPrimitiveValue, K extends FormSpec<K, T>> = {
  [key in keyof K]: Extract<FormPrimitiveValue, K[key]['value']>;
};

type FormElementLike<T> = {
  name: T;
  type?: string;
  value?: string | number | boolean;
  addEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLInputElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  removeEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLInputElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
};

type FormEquals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

interface FormGroup<T> {
  refs: { [key: string]: FormElementLike<any> };
  controllers: T;
  is_valid(): void;
  state(): { [key in keyof T]: string };
  reset(): void;
}

const formStates = new WeakMap<FormSpec<any, any>, FormGroup<any>>();

export function create_form_group<T extends FormSpec<any, any>>(controllers: T): FormGroup<T> {
  return {
    controllers,
    refs: {},
    is_valid() {},
    state(): { [key in keyof T]: string } {
      const builder: { [key: string]: any } = {};

      Object.entries(this.controllers).forEach(([key, value]) => {
        builder[key] = value.value;
      });

      return builder as { [key in keyof T]: string };
    },
    reset() {},
  };
}

export function form_control<T extends FormPrimitiveValue>(defaultValue: T, ...validators: FormValidator[]): FormControl<T> {
  return {
    initialValue: defaultValue,
    value: defaultValue,
    valid: false,
    touched: false,
    validators: [...validators],
  };
}

/** Form hook */
export function use_form<T extends FormSpec<any, any>>(control: T) {
  const [formState] = useState<T>(control);

  let formGroup: FormGroup<T>;
  if (formStates.has(formState)) {
    formGroup = formStates.get(formState)!;
  } else {
    formGroup = create_form_group(formState);

    formStates.set(formState, formGroup);
  }

  function handle_input_change(event: HTMLElementEventMap[keyof HTMLElementEventMap]): void {
    if (!(event && event.srcElement)) return;

    const { value, name } = event.srcElement as HTMLInputElement;

    formState[name].value = value;
  }

  /** Binds an input to this hook. */
  function set<K extends HTMLInputElement>(
    ref: FormElementLike<FormEquals<K['name'], keyof T> extends true ? K['name'] : string> | null,
  ) {
    if (ref) {
      if (typeof formState[ref.name] === 'undefined') {
        throw new Error(`"${ref.name}" is not a valid form group`);
      }

      ref.value = formState[ref.name].value;

      if (!formGroup.refs[ref.name]) {
        ref.addEventListener('input', handle_input_change);

        formGroup.refs[ref.name] = ref;
      }
    }
  }

  /** Wrapper for the a submit callback. */
  const forward = (callback: (data: { [key in keyof T]: T[key]['value'] }) => void) => (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.persist();

    callback(formGroup.state());
  };

  useEffect(() => {
    return () => {
      Object.values(formGroup.refs).forEach((ref) => {
        ref.removeEventListener('input', handle_input_change);
      });
    };
  }, []);

  return {
    set,
    forward,
    formGroup,
  };
}
