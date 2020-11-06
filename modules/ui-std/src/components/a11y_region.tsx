import React, { FC } from 'react';
import { KiraPropType } from '@kira/ui-std';
import styled from 'styled-components';
import { A11yRole } from './a11y_role';

/**
 * A11yRegion
 */
export namespace A11yRegion {
  export type Props = KiraPropType & {
    label: string;
  };

  const elements = {
    container: styled(A11yRole.h)``,
  };

  export const h: FC<Props> = function A11yRegion({ children, label, ...rest }) {
    return (
      <elements.container aria-label={label} role='region' {...rest}>
        {children}
      </elements.container>
    );
  };
}
