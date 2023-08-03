import type { Query } from '../types';
import { querySelectionConverter } from './querySelectionConverter';

const assetIdStubA = '123';
const assetIdStubB = '456';
const assetIdStubC = '789';
const propertyIdStubA = 'abc';
const propertyIdStubB = 'def';
const propertyIdStubC = 'ghi';
const propertyAliasStubA = 'ABC';
const propertyAliasStubB = 'DEF';
const propertyAliasStubC = 'GHI';
const queryStub: Query = {
  assets: [
    {
      assetId: assetIdStubA,
      properties: [{ propertyId: propertyIdStubA }, { propertyId: propertyIdStubB }, { propertyId: propertyIdStubC }],
    },
    { assetId: assetIdStubB, properties: [{ propertyId: propertyIdStubC }, { propertyId: propertyIdStubA }] },
    { assetId: assetIdStubC, properties: [] },
  ],
  properties: [
    { propertyAlias: propertyAliasStubA },
    { propertyAlias: propertyAliasStubB },
    { propertyAlias: propertyAliasStubC },
  ],
};
const selectionStub = {
  assets: [{ id: assetIdStubA }, { id: assetIdStubB }, { id: assetIdStubC }],
  dataStreams: {
    modeled: [
      { assetId: assetIdStubA, id: propertyIdStubA },
      { assetId: assetIdStubA, id: propertyIdStubB },
      { assetId: assetIdStubA, id: propertyIdStubC },
      { assetId: assetIdStubB, id: propertyIdStubC },
      { assetId: assetIdStubB, id: propertyIdStubA },
    ],
    unmodeled: [{ alias: propertyAliasStubA }, { alias: propertyAliasStubB }, { alias: propertyAliasStubC }],
  },
};

describe('querySelectionConverter', () => {
  it('should convert a query to a selection', () => {
    const selection = querySelectionConverter.toSelection(queryStub);

    expect(selection).toEqual(selectionStub);
  });

  it('should convert a selection to a query', () => {
    const query = querySelectionConverter.toQuery([
      ...selectionStub.assets,
      ...selectionStub.dataStreams.modeled,
      ...selectionStub.dataStreams.unmodeled,
    ]);

    expect(query).toEqual(queryStub);
  });

  it('should convert the data without data loss', () => {
    let selection = querySelectionConverter.toSelection(queryStub);
    let query = querySelectionConverter.toQuery([
      ...selection.assets,
      ...selection.dataStreams.modeled,
      ...selection.dataStreams.unmodeled,
    ]);

    expect(selection).toEqual(selectionStub);
    expect(query).toEqual(queryStub);

    // convert the data back and forth a bunch
    new Array(1000).fill(null).forEach(() => {
      selection = querySelectionConverter.toSelection(query);
      query = querySelectionConverter.toQuery([
        ...selection.assets,
        ...selection.dataStreams.modeled,
        ...selection.dataStreams.unmodeled,
      ]);
    });

    expect(selection).toEqual(selectionStub);
    expect(query).toEqual(queryStub);
  });
});
