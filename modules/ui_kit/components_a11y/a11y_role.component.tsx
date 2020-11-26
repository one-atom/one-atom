import React, { FC } from 'react';
import { OneAtomCommonPropType } from '../prop_type';
import styled from 'styled-components';

/**
 * A11yRole
 */
export namespace A11yRole {
  // prettier-ignore
  export type Props = OneAtomCommonPropType & {
    role:
      | 'alert'         // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Alert_Role
      | 'application'   // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Application_Role
      | 'article'       // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Article_Role
      | 'banner'        // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Banner_role
      | 'button'        // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role
      | 'cell'          // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Cell_Role
      | 'checkbox'      // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/checkbox_role
      | 'comment'       // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Comment_role
      | 'complementary' // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Complementary_role
      | 'contentinfo'   // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Contentinfo_role
      | 'dialog'        // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/dialog_role
      | 'document'      // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Document_Role
      | 'feed'          // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Feed_Role
      | 'figure'        // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Figure_Role
      | 'form'          // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Form_Role
      | 'grid'          // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Grid_Role
      | 'gridcell'      // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Gridcell_role
      | 'heading'       // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/heading_role
      | 'img'           // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Role_Img
      | 'list'          // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/List_role
      | 'listbox'       // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/listbox_role
      | 'listitem'      // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Listitem_role
      | 'main'          // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Main_role
      | 'mark'          // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Mark_role
      | 'navigation'    // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Navigation_Role
      | 'region'        // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Region_role
      | 'row'           // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Row_Role
      | 'rowgroup'      // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Rowgroup_Role
      | 'search'        // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Search_role
      | 'suggestion'    // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Suggestion_role
      | 'switch'        // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Switch_role
      | 'tab'           // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Tab_Role
      | 'table'         // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Table_Role
      | 'tabpanel'      // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/ARIA:_tabpanel_role
      | 'textbox'       // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/textbox_role
      | 'timer'         // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/ARIA_timer_role
  };

  const elements = {
    container: styled.div``,
  };

  export const h: FC<Props> = function A11yRole({ children, role, ...rest }) {
    return (
      <elements.container role={role} {...rest}>
        {children}
      </elements.container>
    );
  };
}
