
import { OneAtomCommonPropType } from '../prop_type';
import styled from 'styled-components';
import { A11yRole } from './a11y_role.component';

/**
 * A11yRegion
 */
export namespace A11yRegion {
  export type Props = OneAtomCommonPropType & {
    label: string;
  };

  const elements = {
    container: styled(A11yRole.h)``,
  };

  export const h: FC<Props> = function A11yRegion({ children, label, ...rest }) {
    return (
      <elements.container aria-label={label} role="region" {...rest}>
        {children}
      </elements.container>
    );
  };
}
