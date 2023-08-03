import type { Query } from '../types';
import { selectionFactory } from './selectionFactory';

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

describe('selectionFactory', () => {
  it('creates a selection', () => {
    const selection = selectionFactory.create(queryStub);

    expect(selection).toEqual({
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
    });
  });
});
