import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { StyleSheetController } from '../helpers/style_sheet_controller';
import { Logger } from '@kira/logger';
import { KiraPropType } from '../prop_type';

/**
 * Portal
 */
export namespace Portal {
  export type Props = KiraPropType;

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
    '#kira-portal',
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

  export const h: React.FC<Props> = ({ children }) => {
    const mount = document.getElementById(id);
    const el = document.createElement('div');
    el.className = className;

    if (!mount) throw new Error("root element was removed, don't do that");

    useEffect(() => {
      mount.appendChild(el);

      return () => {
        mount.removeChild(el);
      };
    }, [mount, el]);

    return createPortal(children, el);
  };
}
