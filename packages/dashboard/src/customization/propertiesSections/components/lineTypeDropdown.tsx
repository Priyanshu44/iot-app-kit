import FormField from '@cloudscape-design/components/form-field';
import Select from '@cloudscape-design/components/select';
import type { FC } from 'react';
import React from 'react';

const defaultTypeOption = { label: 'Linear', value: 'linear', description: 'Points are joined as straight lines.' };
const typeOptions = [
  { label: 'None', value: 'none', description: 'Scatter plot with no line between the points.' },
  defaultTypeOption,
  { label: 'Step before', value: 'step-start', description: 'Step points rendered at the end of the step.' },
  { label: 'Step middle', value: 'step-middle', description: 'Step points rendered in the middle of the step.' },
  { label: 'Step after', value: 'step-end', description: 'Step points rendered at the beginning of the step.' },
] as const;

type TypeSectionOptions = {
  disabled?: boolean;
  type: string | undefined;
  updateType: (type: string) => void;
};

export const LineTypeSection: FC<TypeSectionOptions> = ({ disabled = false, type, updateType }) => {
  return (
    <FormField label='Line type'>
      <Select
        disabled={disabled}
        selectedOption={typeOptions.find(({ value }) => value === type) ?? null}
        onChange={({ detail }) => updateType(detail.selectedOption.value ?? defaultTypeOption.value)}
        options={typeOptions}
      />
    </FormField>
  );
};
