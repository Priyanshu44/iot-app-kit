import wrapper from '@awsui/components-react/test-utils/dom';
import { act, render } from '@testing-library/react';
import React from 'react';

import { getGlobalSettings } from '../../../common/GlobalSettings';
import { useStore } from '../../../store';
import { KnownSceneProperty, COMPOSER_FEATURES } from '../../../interfaces';

import { SceneBackgroundSettingsEditor } from './SceneBackgroundSettingsEditor';

jest.mock('../../../common/GlobalSettings');

jest.mock('@awsui/components-react', () => ({
  ...jest.requireActual('@awsui/components-react'),
}));

describe('SceneBackgroundSettingsEditor', () => {
  const setScenePropertyMock = jest.fn();
  const getScenePropertyMock = jest.fn();
  const showAssetBrowserCallbackMock = jest.fn();

  const mockFeatureConfigOn = { [COMPOSER_FEATURES.Textures]: true };

  const baseState = {
    setSceneProperty: setScenePropertyMock,
    getSceneProperty: getScenePropertyMock,
    getEditorConfig: () => ({
      showAssetBrowserCallback: showAssetBrowserCallbackMock,
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should save background on clean scene', () => {
    getScenePropertyMock.mockReturnValue(undefined);
    const globalSettingsMock = getGlobalSettings as jest.Mock;
    globalSettingsMock.mockReturnValue({ featureConfig: mockFeatureConfigOn });
    useStore('default').setState(baseState);

    render(<SceneBackgroundSettingsEditor />);

    expect(setScenePropertyMock).toBeCalledTimes(1);
    expect(setScenePropertyMock).toBeCalledWith(KnownSceneProperty.SceneBackgroundSettings, {
      color: '#2a2e33',
    });
  });

  it('should update background when colors changes', () => {
    getScenePropertyMock.mockImplementation((property: string) => {
      if (property === KnownSceneProperty.SceneBackgroundSettings) {
        return {
          color: '#cccccc',
        };
      } else if (property === KnownSceneProperty.BackgroundCustomColors) {
        const customColors: string[] = [];
        return customColors;
      }
    });
    const globalSettingsMock = getGlobalSettings as jest.Mock;
    globalSettingsMock.mockReturnValue({ featureConfig: mockFeatureConfigOn });
    useStore('default').setState(baseState);
    const { container } = render(<SceneBackgroundSettingsEditor />);
    const polarisWrapper = wrapper(container);
    const colorInput = polarisWrapper.findInput('[data-testid="hexcode"]');

    expect(colorInput).toBeDefined();

    // click checkbox should update store
    colorInput!.focus();
    colorInput!.setInputValue('#FFFFFF');
    colorInput!.blur();
    expect(setScenePropertyMock).toBeCalledTimes(2);
    expect(setScenePropertyMock).toBeCalledWith(KnownSceneProperty.SceneBackgroundSettings, {
      color: '#FFFFFF',
    });
  });

  it('should open asset browser when select texture clicked and set texture uri', () => {
    getScenePropertyMock.mockReturnValue({
      color: '#cccccc',
    });
    const globalSettingsMock = getGlobalSettings as jest.Mock;
    globalSettingsMock.mockReturnValue({ featureConfig: mockFeatureConfigOn });
    showAssetBrowserCallbackMock.mockImplementation((cb) => {
      cb(null, 'c:\file.jpg');
    });
    useStore('default').setState(baseState);
    const { container } = render(<SceneBackgroundSettingsEditor />);
    const polarisWrapper = wrapper(container);
    const selectTextureButton = polarisWrapper.findButton('[data-testid="select-texture-button"]');

    expect(selectTextureButton).toBeDefined();

    // click checkbox should update store
    act(() => {
      selectTextureButton!.click();
    });
    expect(showAssetBrowserCallbackMock).toBeCalledTimes(1);
    expect(setScenePropertyMock).toBeCalledWith(KnownSceneProperty.SceneBackgroundSettings, {
      textureUri: 'c:\file.jpg',
    });
  });

  it('should remove texture uri', () => {
    getScenePropertyMock.mockReturnValue({
      textureUri: 'filepath',
    });
    const globalSettingsMock = getGlobalSettings as jest.Mock;
    globalSettingsMock.mockReturnValue({ featureConfig: mockFeatureConfigOn });
    useStore('default').setState(baseState);
    const { container } = render(<SceneBackgroundSettingsEditor />);
    const polarisWrapper = wrapper(container);
    const removeTextureButton = polarisWrapper.findButton('[data-testid="remove-texture-button"]');

    expect(removeTextureButton).toBeDefined();

    // click checkbox should update store
    act(() => {
      removeTextureButton!.click();
    });
    expect(setScenePropertyMock).toBeCalledWith(KnownSceneProperty.SceneBackgroundSettings, {
      color: '#2a2e33',
    });
  });
});
