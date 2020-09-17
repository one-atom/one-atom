import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { StyleSheetController } from '../helpers/style_sheet_controller';
import { Logger } from '@kira/logger';
import { KiraPropType } from '../prop_type';

/**
 * Portal
 */
export namespace Portal {
  export type Props = {
    mountTo?: string | HTMLElement;
  } & KiraPropType;

  const id = 'kira-portal';
  const className = `${id}-container`;

  if (!document.getElementById(id)) {
    const root_element = document.createElement('div');
    root_element.id = id;
    document.body!.appendChild(root_element);
  } else {
    Logger.assert(Logger.Level.WARN, 'multiple instances of kira-ui-common has been made');
  }

  const style_sheet = new StyleSheetController();

  style_sheet.add_to_register(
    `#${id}`,
    `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
    `,
  );

  style_sheet.add_to_register(
    className,
    `
      display: contents;
    `,
  );

  export const h: React.FC<Props> = ({ children, mountTo }) => {
    let mount: HTMLElement;

    if (typeof mountTo === 'string') {
      const kiraPortal = document.getElementById(mountTo);
      if (!kiraPortal) throw new Error(`Could not find an element ${mountTo}`);
      mount = kiraPortal;
    } else if (mountTo instanceof HTMLElement) {
      mount = mountTo;
    } else {
      const kiraPortal = document.getElementById(id);
      if (!kiraPortal) throw new Error("root element was removed, don't do that");
      mount = kiraPortal;
    }

    const el = document.createElement('div');
    el.className = className;
    useEffect(() => {
      mount.appendChild(el);

      return () => {
        mount.removeChild(el);
      };
    }, [mount, el]);

    return createPortal(children, el);
  };
}
