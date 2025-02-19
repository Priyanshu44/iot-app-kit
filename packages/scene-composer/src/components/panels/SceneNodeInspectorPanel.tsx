import { Checkbox, FormField, TextContent } from '@awsui/components-react';
import { debounce } from 'lodash';
import React, { useCallback, useContext, useRef } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import * as THREE from 'three';

import { getGlobalSettings } from '../../common/GlobalSettings';
import { TABBED_PANEL_CONTAINER_NAME } from '../../common/internalConstants';
import { sceneComposerIdContext } from '../../common/sceneComposerIdContext';
import { COMPOSER_FEATURES, IDataOverlayComponent, KnownComponentType } from '../../interfaces';
import useLifecycleLogging from '../../logger/react-logger/hooks/useLifecycleLogging';
import LogProvider from '../../logger/react-logger/log-provider';
import { Component } from '../../models/SceneModels';
import { ISceneNodeInternal, useEditorState, useSceneDocument } from '../../store';
import { useSnapObjectToFloor } from '../../three/transformUtils';
import { findComponentByType } from '../../utils/nodeUtils';
import { isLinearPlaneMotionIndicator } from '../../utils/sceneComponentUtils';
import { toNumber } from '../../utils/stringUtils';
import { RecursivePartial } from '../../utils/typeUtils';
import { isDynamicNode } from '../../utils/entityModelUtils/sceneUtils';

import { AddComponentMenu } from './AddComponentMenu';
import { ExpandableInfoSection, Matrix3XInputGrid, TextInput, Triplet } from './CommonPanelComponents';
import { ComponentEditMenu } from './ComponentEditMenu';
import { ComponentEditor } from './ComponentEditor';
import DebugInfoPanel from './scene-components/debug/DebugPanel';

export const SceneNodeInspectorPanel: React.FC = () => {
  const log = useLifecycleLogging('SceneNodeInspectorPanel');
  const sceneComposerId = useContext(sceneComposerIdContext);
  const { selectedSceneNodeRef } = useEditorState(sceneComposerId);
  const { getSceneNodeByRef, updateSceneNodeInternal } = useSceneDocument(sceneComposerId);
  const selectedSceneNode = getSceneNodeByRef(selectedSceneNodeRef);
  const intl = useIntl();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const subModelMovementEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.SubModelMovement];

  const i18nKnownComponentTypesStrings = defineMessages({
    [KnownComponentType.ModelRef]: {
      defaultMessage: 'Model Reference',
      description: 'Expandable Section title',
    },
    [KnownComponentType.SubModelRef]: {
      defaultMessage: 'Model Reference',
      description: 'Expandable Section Title',
    },
    [KnownComponentType.Camera]: {
      defaultMessage: 'Camera',
      description: 'Expandable Section title',
    },
    [KnownComponentType.Light]: {
      defaultMessage: 'Light',
      description: 'Expandable Section title',
    },
    [KnownComponentType.Tag]: {
      defaultMessage: 'Tag',
      description: 'Expandable Section title',
    },
    [KnownComponentType.EntityBinding]: {
      defaultMessage: 'Entity data binding',
      description: 'Expandable Section title',
    },
    [KnownComponentType.ModelShader]: {
      defaultMessage: 'Model Shader',
      description: 'Expandable Section title',
    },
    [KnownComponentType.MotionIndicator]: {
      defaultMessage: 'Motion Indicator',
      description: 'Expandable Section title',
    },
    [Component.DataOverlaySubType.TextAnnotation]: {
      defaultMessage: 'Annotation',
      description: 'Expandable Section title',
    },
    [Component.DataOverlaySubType.OverlayPanel]: {
      defaultMessage: 'Overlay',
      description: 'Expandable Section title',
    },
    [KnownComponentType.Animation]: {
      defaultMessage: 'Animation',
      description: 'Expandable Section title',
    },
    [KnownComponentType.PlaneGeometry]: {
      defaultMessage: 'Plane Geometry',
      description: 'Expandable Section title',
    },
  });

  log?.verbose('render inspect panel with selected scene node ', selectedSceneNodeRef, selectedSceneNode);

  const applySnapToFloorConstraint = useSnapObjectToFloor((position, sceneNode) => {
    updateSceneNodeInternal(sceneNode.ref, { transform: { position } }, true);
  }, selectedSceneNode);

  const isModelComponent = !!findComponentByType(selectedSceneNode, KnownComponentType.ModelRef);
  const isCameraComponent = !!findComponentByType(selectedSceneNode, KnownComponentType.Camera);
  const isTagComponent = !!findComponentByType(selectedSceneNode, KnownComponentType.Tag);
  const isOverlayComponent = !!findComponentByType(selectedSceneNode, KnownComponentType.DataOverlay);
  const isSubModelComponent = !!findComponentByType(selectedSceneNode, KnownComponentType.SubModelRef);

  const debounceInterval = isDynamicNode(selectedSceneNode) ? 1000 : 100;

  const transformVisible = !isSubModelComponent || subModelMovementEnabled;

  const shouldShowScale = !(isTagComponent || isCameraComponent);

  const readonly: Triplet<boolean> = [false, false, false];

  const handleInputChanges = (value: RecursivePartial<ISceneNodeInternal>) => {
    if (selectedSceneNodeRef && selectedSceneNode) {
      updateSceneNodeInternal(selectedSceneNodeRef, value);
    }
  };

  const scrollToBottom = useCallback(() => {
    // Use setTimeout to let page updates with the new component first, so the page
    // will have the new component rendered before scrolling to bottom.
    setTimeout(() => {
      // TODO: better better way to find the element to scroll
      let scrollElement: HTMLElement | null = containerRef.current;

      // find the TABBED_PANEL_CONTAINER element
      while (scrollElement) {
        if (scrollElement.className.includes(TABBED_PANEL_CONTAINER_NAME)) {
          break;
        }
        scrollElement = scrollElement.parentElement;
      }

      // Scroll the parent of TABBED_PANEL_CONTAINER element
      scrollElement?.parentElement?.scroll({
        top: scrollElement.scrollHeight,
        behavior: 'smooth',
      });
    }, 5);
  }, [containerRef.current]);

  if (!selectedSceneNode) {
    return (
      <ExpandableInfoSection
        title={intl.formatMessage({ defaultMessage: 'Properties', description: 'Section title' })}
        defaultExpanded
      >
        <TextContent>
          <p>
            {intl.formatMessage({
              defaultMessage: 'No node selected.',
              description: 'Placeholder one no node selected',
            })}
          </p>
        </TextContent>
      </ExpandableInfoSection>
    );
  }

  const componentViews = selectedSceneNode.components.map((component, index) => {
    return (
      <React.Fragment key={component.type + '_' + index}>
        <ExpandableInfoSection
          withoutSpaceBetween
          key={component.type + '_' + index}
          title={
            (component.type === KnownComponentType.DataOverlay
              ? intl.formatMessage(i18nKnownComponentTypesStrings[(component as IDataOverlayComponent).subType]) ||
                (component as IDataOverlayComponent).subType
              : intl.formatMessage(i18nKnownComponentTypesStrings[component.type])) || component.type
          }
          headerButton={
            selectedSceneNodeRef && <ComponentEditMenu nodeRef={selectedSceneNodeRef} currentComponent={component} />
          }
        >
          <ComponentEditor node={selectedSceneNode} component={component} />
        </ExpandableInfoSection>
      </React.Fragment>
    );
  });

  return (
    <LogProvider namespace='SceneNodeInspectorPanel'>
      <div ref={containerRef} style={{ overflow: 'auto' }}>
        <AddComponentMenu onSelect={scrollToBottom} />
        <DebugInfoPanel />
        <ExpandableInfoSection
          title={intl.formatMessage({ defaultMessage: 'Properties', description: 'Section title' })}
          defaultExpanded
        >
          <FormField label={intl.formatMessage({ defaultMessage: 'Name', description: 'Form field label' })}>
            <TextInput value={selectedSceneNode.name} setValue={(e) => handleInputChanges({ name: e?.toString() })} />
          </FormField>
        </ExpandableInfoSection>
        {transformVisible && (
          <ExpandableInfoSection
            title={intl.formatMessage({ defaultMessage: 'Transform', description: 'Expandable section title' })}
            defaultExpanded
          >
            <Matrix3XInputGrid
              name={intl.formatMessage({ defaultMessage: 'Position', description: 'Input Grid title name' })}
              labels={['X', 'Y', 'Z']}
              values={selectedSceneNode.transform.position}
              disabled={[false, selectedSceneNode.transformConstraint.snapToFloor === true, false]}
              readonly={readonly}
              toStr={(a) => a.toFixed(3)}
              fromStr={toNumber}
              onChange={debounce((items) => {
                handleInputChanges({ transform: { position: items } });
                applySnapToFloorConstraint();
              }, debounceInterval)}
            />
            <Matrix3XInputGrid
              name={intl.formatMessage({ defaultMessage: 'Rotation', description: 'Input Grid title name' })}
              labels={['X', 'Y', 'Z']}
              values={selectedSceneNode.transform.rotation}
              toStr={(a) => THREE.MathUtils.radToDeg(a).toFixed(3)}
              fromStr={(s) => THREE.MathUtils.degToRad(toNumber(s))}
              disabled={isTagComponent || isOverlayComponent ? [true, true, true] : [false, false, false]}
              readonly={readonly}
              onChange={debounce((items) => {
                handleInputChanges({ transform: { rotation: items } });
                applySnapToFloorConstraint();
              }, debounceInterval)}
            />
            {shouldShowScale && (
              <Matrix3XInputGrid
                name={intl.formatMessage({ defaultMessage: 'Scale', description: 'Input Grid title name' })}
                labels={['X', 'Y', 'Z']}
                disabled={
                  isTagComponent || isOverlayComponent
                    ? [true, true, true]
                    : [false, isLinearPlaneMotionIndicator(selectedSceneNode), false]
                }
                readonly={readonly}
                values={selectedSceneNode.transform.scale}
                toStr={(a) => a.toFixed(3)}
                fromStr={toNumber}
                onChange={debounce((items) => {
                  handleInputChanges({ transform: { scale: items } });
                  applySnapToFloorConstraint();
                }, debounceInterval)}
              />
            )}
            {isModelComponent && (
              <FormField label={intl.formatMessage({ defaultMessage: 'Constraints', description: 'Form field label' })}>
                <Checkbox
                  checked={selectedSceneNode.transformConstraint.snapToFloor === true}
                  onChange={({ detail: { checked } }) => {
                    handleInputChanges({ transformConstraint: { snapToFloor: checked } });
                    applySnapToFloorConstraint();
                  }}
                >
                  {intl.formatMessage({ defaultMessage: 'Snap to floor', description: 'checkbox option' })}
                </Checkbox>
              </FormField>
            )}
          </ExpandableInfoSection>
        )}

        {componentViews}
      </div>
    </LogProvider>
  );
};
