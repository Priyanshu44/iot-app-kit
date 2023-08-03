import { queryFactory } from './queryFactory';
import type { SelectedAsset, SelectedModeledDataStream, SelectedUnmodeledDataStream } from '../types';

describe('queryFactory', () => {
  it('should return an empty query when called with an empty list', () => {
    const query = queryFactory.create([]);

    expect(query).toEqual({ assets: [], properties: [] });
  });

  it('should create a query from selected assets and data streams', () => {
    const assetA: SelectedAsset = { id: '123' };
    const assetB: SelectedAsset = { id: '456' };
    const modeledDataStreamA: SelectedModeledDataStream = { assetId: 'abc', id: 'def' };
    const modeledDataStreamB: SelectedModeledDataStream = { assetId: 'ghi', id: 'jkl' };
    const unmodeledDataStreamA: SelectedUnmodeledDataStream = { alias: 'ABC' };
    const unmodeledDataStreamB: SelectedUnmodeledDataStream = { alias: 'DEF' };
    const query = queryFactory.create([
      assetA,
      modeledDataStreamA,
      assetB,
      modeledDataStreamB,
      unmodeledDataStreamA,

      unmodeledDataStreamB,
    ]);

    expect(query).toEqual({
      assets: expect.arrayContaining([
        { assetId: assetA.id, properties: [] },
        { assetId: modeledDataStreamA.assetId, properties: [{ propertyId: modeledDataStreamA.id }] },
        { assetId: assetB.id, properties: [] },
        { assetId: modeledDataStreamB.assetId, properties: [{ propertyId: modeledDataStreamB.id }] },
      ]),
      properties: expect.arrayContaining([
        { propertyAlias: unmodeledDataStreamA.alias },
        { propertyAlias: unmodeledDataStreamB.alias },
      ]),
    });
  });

  it('should merge queries for the same asset', () => {
    const assetId = '123';
    const assetA: SelectedAsset = { id: assetId };
    const assetB: SelectedAsset = { id: assetId };
    const query = queryFactory.create([assetA, assetB]);

    expect(query).toEqual({
      assets: [{ assetId: assetId, properties: [] }],
      properties: [],
    });
  });

  it('should merge queries for the same modeled data stream', () => {
    const assetId = '123';
    const propertyIdA = 'abc';
    const propertyIdB = 'def';
    const modeledDataStreamA: SelectedModeledDataStream = { assetId, id: propertyIdA };
    const modeledDataStreamB: SelectedModeledDataStream = { assetId, id: propertyIdB };
    const modeledDataStreamC: SelectedModeledDataStream = { assetId, id: propertyIdA };
    const query = queryFactory.create([modeledDataStreamA, modeledDataStreamB, modeledDataStreamC]);

    expect(query).toEqual({
      assets: [
        {
          assetId: assetId,
          properties: expect.arrayContaining([
            { propertyId: modeledDataStreamA.id },
            { propertyId: modeledDataStreamB.id },
          ]),
        },
      ],
      properties: [],
    });
  });

  it('should merge queries for modeled data streams with the same asset', () => {
    const assetId = '123';
    const modeledDataStreamA: SelectedModeledDataStream = { assetId, id: '123' };
    const modeledDataStreamB: SelectedModeledDataStream = { assetId, id: '456' };
    const query = queryFactory.create([modeledDataStreamA, modeledDataStreamB]);

    expect(query).toEqual({
      assets: [
        {
          assetId: assetId,
          properties: expect.arrayContaining([
            { propertyId: modeledDataStreamA.id },
            { propertyId: modeledDataStreamB.id },
          ]),
        },
      ],
      properties: [],
    });
  });

  it('should merge queries for the same asset', () => {
    const assetIdA = '123';
    const assetIdB = '456';
    const assetIdC = '789';
    const propertyIdA = 'abc';
    const propertyIdB = 'def';
    const propertyIdC = 'ghi';

    const assetA: SelectedAsset = { id: assetIdA };
    const assetB: SelectedAsset = { id: assetIdA };
    const assetC: SelectedAsset = { id: assetIdB };
    const assetD: SelectedAsset = { id: assetIdC };
    const modeledDataStreamA: SelectedModeledDataStream = { assetId: assetIdA, id: propertyIdA };
    const modeledDataStreamB: SelectedModeledDataStream = { assetId: assetIdA, id: propertyIdB };
    const modeledDataStreamC: SelectedModeledDataStream = { assetId: assetIdB, id: propertyIdC };
    const modeledDataStreamD: SelectedModeledDataStream = { assetId: assetIdC, id: propertyIdC };

    const query = queryFactory.create([
      assetA,
      assetB,
      assetC,
      assetD,
      modeledDataStreamA,
      modeledDataStreamB,
      modeledDataStreamC,
      modeledDataStreamD,
    ]);

    expect(query).toEqual({
      assets: expect.arrayContaining([
        {
          assetId: assetIdA,
          properties: [{ propertyId: modeledDataStreamA.id }, { propertyId: modeledDataStreamB.id }],
        },
        {
          assetId: assetIdB,
          properties: [{ propertyId: modeledDataStreamC.id }],
        },
        {
          assetId: assetIdC,
          properties: [{ propertyId: modeledDataStreamD.id }],
        },
      ]),
      properties: [],
    });
  });

  it('should merge queries for the same unmodeled data stream', () => {
    const alias = 'ABC';
    const unmodeledDataStreamA: SelectedUnmodeledDataStream = { alias };
    const unmodeledDataStreamB: SelectedUnmodeledDataStream = { alias };
    const query = queryFactory.create([unmodeledDataStreamA, unmodeledDataStreamB]);

    expect(query).toEqual({
      assets: [],
      properties: [{ propertyAlias: alias }],
    });
  });
});
