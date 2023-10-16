import React, { memo } from 'react';
import SpaceBetween from '@cloudscape-design/components/space-between';
import {
  spaceFieldHorizontal,
  colorBorderDividerDefault,
  spaceStaticXxxs,
  spaceStaticXxl,
  spaceStaticS,
  colorTextHeadingDefault,
} from '@cloudscape-design/design-tokens';
import {
  ComponentLibraryComponentMap,
  ComponentLibraryComponentOrdering,
} from '~/customization/componentLibraryComponentMap';
import PaletteComponent from './component';
import './index.css';

/* added left padding as per UX and top padding for positioning Icons Vertically centre */
const palettePadding = {
  padding: `${spaceFieldHorizontal} ${0} ${0} ${spaceFieldHorizontal}`,
};

const widgetHeading = {
  color: colorTextHeadingDefault,
};

const divider = {
  width: spaceStaticXxxs,
  height: spaceStaticXxl,
  margin: `${0} ${spaceStaticS}`,
  backgroundColor: colorBorderDividerDefault,
};

const Divider = () => <div style={divider} />;

const Palette = () => {
  return (
    <div style={palettePadding} className='widget-panel'>
      <h4 style={widgetHeading}>Widgets</h4>
      <Divider />
      <SpaceBetween size='xxxs' direction='horizontal'>
        {ComponentLibraryComponentOrdering.map((widgetType) => {
          const [name, iconComponent] = ComponentLibraryComponentMap[widgetType];
          return (
            <PaletteComponent key={widgetType} componentTag={widgetType} name={name} IconComponent={iconComponent} />
          );
        })}
      </SpaceBetween>
    </div>
  );
};

export default memo(Palette);
