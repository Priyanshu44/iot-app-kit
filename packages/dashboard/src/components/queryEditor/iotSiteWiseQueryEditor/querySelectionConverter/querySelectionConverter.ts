import { queryFactory } from '../queryFactory';
import { selectionFactory } from '../selectionFactory';

export const querySelectionConverter = {
  toQuery: queryFactory.create,
  toSelection: selectionFactory.create,
};
