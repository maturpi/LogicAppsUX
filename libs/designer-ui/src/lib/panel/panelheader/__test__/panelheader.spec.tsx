import { MenuItemType } from '../../../card/types';
import type { PanelHeaderProps } from '../panelheader';
import { PanelHeaderControlType, PanelHeader } from '../panelheader';
import { initializeIcons } from '@fluentui/react';
import React from 'react';
import renderer from 'react-test-renderer';
import * as ReactShallowRenderer from 'react-test-renderer/shallow';

describe('lib/panel/panelheader/main', () => {
  let minimal: PanelHeaderProps;
  let minimalWithHeader: PanelHeaderProps;
  let shallow: ReactShallowRenderer.ShallowRenderer;

  beforeEach(() => {
    minimal = {
      isCollapsed: false,
      panelHeaderMenu: [],
      setIsCollapsed: jest.fn(),
    };
    minimalWithHeader = {
      isCollapsed: false,
      panelHeaderMenu: [
        {
          disabled: false,
          type: MenuItemType.Advanced,
          disabledReason: 'Comments can only be added while editing the inputs of a step.',
          iconName: 'Comment',
          key: 'Comment',
          title: 'Add a comment',
          onClick: jest.fn(),
        },
        {
          disabled: false,
          type: MenuItemType.Advanced,
          disabledReason: 'This operation has already been deleted.',
          iconName: 'Delete',
          key: 'Delete',
          title: 'Delete',
          onClick: jest.fn(),
        },
      ],
      setIsCollapsed: jest.fn(),
    };
    shallow = ReactShallowRenderer.createRenderer();
    initializeIcons();
  });

  afterEach(() => {
    shallow.unmount();
  });

  it('should render', () => {
    const panelheader = renderer.create(<PanelHeader {...minimal} />).toJSON();
    expect(panelheader).toMatchSnapshot();
  });

  it('should render with panel header menu', () => {
    const props = {
      ...minimalWithHeader,
    };

    const panelheader = renderer.create(<PanelHeader {...props} />).toJSON();
    expect(panelheader).toMatchSnapshot();
  });

  it('should have display header content with Menu', () => {
    const props = {
      ...minimalWithHeader,
      isRight: false,
      comment: 'sample comment',
      titleId: 'title id',
      panelHeaderControlType: PanelHeaderControlType.MENU,
      noNodeSelected: false,
      readOnlyMode: false,
      renameTitleDisabled: false,
      showCommentBox: true,
      title: 'sample title',
    };
    shallow.render(<PanelHeader {...props} />);
    const panelHeader = shallow.getRenderOutput();
    expect(panelHeader.props.className).toBe('msla-panel-header');

    const [collapseExpand, cardHeader]: any[] = React.Children.toArray(panelHeader.props.children);
    expect(collapseExpand.props.content).toBe('Collapse/Expand');

    const icon = collapseExpand.props.children;

    expect(icon.props.className).toBe('collapse-toggle-left');
    expect(icon.props.ariaLabel).toBe('Collapse/Expand');
    expect(icon.props.disabled).toBeFalsy();
    expect(icon.props.iconProps).toEqual({ iconName: 'DoubleChevronRight8' });

    expect(cardHeader.props.className).toBe('msla-panel-card-header');
    const [titleContainer, panelControls, comment]: any[] = React.Children.toArray(cardHeader.props.children);

    expect(titleContainer.props.className).toBe('msla-title-container');

    const title = titleContainer.props.children;
    expect(title.props.titleId).toBe(props.titleId);
    expect(title.props.readOnlyMode).toBe(props.readOnlyMode);
    expect(title.props.renameTitleDisabled).toBe(props.renameTitleDisabled);
    expect(title.props.title).toBe(props.title);

    expect(panelControls.props.className).toBe('msla-panel-header-controls');

    const menu = panelControls.props.children[0];
    // Using an empty overflow set to render menu items
    expect(menu.props.items).toHaveLength(0);
    expect(menu.props.overflowItems).toHaveLength(minimalWithHeader.panelHeaderMenu.length);

    expect(comment.props.comment).toBe(props.comment);
    expect(comment.props.isCollapsed).toBe(props.isCollapsed);
    expect(comment.props.noNodeSelected).toBe(props.noNodeSelected);
    expect(comment.props.readOnlyMode).toBe(props.readOnlyMode);
  });

  it('should have display header content with Dismiss', () => {
    const props = {
      ...minimalWithHeader,
      isRight: false,
      comment: 'sample comment',
      titleId: 'title id',
      panelHeaderControlType: PanelHeaderControlType.DISMISS_BUTTON,
      noNodeSelected: false,
      readOnlyMode: false,
      renameTitleDisabled: false,
      showCommentBox: true,
      title: 'sample title',
    };
    shallow.render(<PanelHeader {...props} />);
    const panelHeader = shallow.getRenderOutput();
    const [, cardHeader]: any[] = React.Children.toArray(panelHeader.props.children);
    const [, panelControls]: any[] = React.Children.toArray(cardHeader.props.children);
    expect(panelControls.props.className).toBe('msla-panel-header-controls');

    const dismiss = panelControls.props.children[1];
    expect(dismiss.props.content).toBe('Dismiss');

    const button = dismiss.props.children;
    expect(button.props).toHaveProperty('iconProps');
    expect(button.props.iconProps).toEqual({ iconName: 'Clear' });
  });
});