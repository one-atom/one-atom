/* eslint-disable @typescript-eslint/no-explicit-any*/
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { useEffect } from 'react';

export function use_outside_click(ref: React.RefObject<HTMLElement>, handler: any): void {
  const handle_click = (event: TouchEvent | MouseEvent) => {
    if (ref && (!ref.current || ref.current.contains(event.target as Node))) {
      return;
    }

    handler(event);
  };

  useEffect(() => {
    addEventListener('mousedown', handle_click);
    addEventListener('touchstart', handle_click);

    // disposer
    return () => {
      removeEventListener('mousedown', handle_click);
      removeEventListener('touchstart', handle_click);
    };
  }, []);
}
