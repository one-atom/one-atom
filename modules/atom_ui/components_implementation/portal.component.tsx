/// <reference types="../environment" />
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { StyleSheetController } from '../helpers/style_sheet_controller';
import { Logger } from '../../logger/mod';
import { OneAtomCommonPropType } from '../prop_type';

/**
 * Portal
 */
export namespace Portal {
  export type Props = {
    mountTo?: string | HTMLElement;
  } & OneAtomCommonPropType;

  const id = 'one-atom-portal';
  const className = `${id}-container`;

  if (!document.getElementById(id)) {
    const root_element = document.createElement('div');
    root_element.id = id;
    document.body!.appendChild(root_element);
  } else {
    Logger.assert(Logger.Level.WARN, "multiple instances of One Atom's portal has been made");
  }

  const style_sheet = new StyleSheetController();

  style_sheet.addToRegister(
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

  style_sheet.addToRegister(
    className,
    `
      display: contents;
    `,
  );

  export const h: FC<Props> = function OneAtom_Portal({ children, mountTo }) {
    let mount: HTMLElement;

    if (typeof mountTo === 'string') {
      const oneAtomPortal = document.getElementById(mountTo);
      if (!oneAtomPortal) throw new Error(`Could not find an element ${mountTo}`);
      mount = oneAtomPortal;
    } else if (mountTo instanceof HTMLElement) {
      mount = mountTo;
    } else {
      const oneAtomPortal = document.getElementById(id);
      if (!oneAtomPortal) throw new Error("root element was removed, don't do that");
      mount = oneAtomPortal;
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
