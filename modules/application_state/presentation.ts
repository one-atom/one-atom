/* eslint-disable @typescript-eslint/ban-types */
import { ConcurrentPresentation } from './concurrent_presentation';
import { Flow, FlowPresentation } from './flow_presentation';
import { SynchronousPresentation } from './synchronous_presentation';

export namespace Presentation {
  export function create<T extends object>(initialValue: T): SynchronousPresentation<T> {
    return new SynchronousPresentation(initialValue);
  }

  export function createConcurrent<T extends object>(initialValue: T): ConcurrentPresentation<T> {
    return new ConcurrentPresentation(initialValue);
  }

  export function createFlow<T extends object>(spec: { initialValue?: T; designatedFlowState?: Flow }): FlowPresentation<T> {
    return new FlowPresentation({
      initialValue: spec.initialValue,
      designatedFlowState: spec.designatedFlowState,
    });
  }
}
