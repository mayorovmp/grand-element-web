import { Request } from '@models/Request';
export const alphaBeticalSorting = (
  itemList: Request[],
  sortingCol: string,
  nested: number,
  sortingValueType: string
) => {
  itemList.sort((a, b) => {
    let aValue = a[sortingCol];
    let bValue = b[sortingCol];
    if (nested === 1) {
      const splitedCol = sortingCol.split('.');
      aValue = a[splitedCol[0]];
      bValue = b[splitedCol[0]];
      aValue = aValue[splitedCol[1]];
      bValue = bValue[splitedCol[1]];
    }
    if (!aValue) {
      aValue = '';
    }
    if (!bValue) {
      bValue = '';
    }
    if (sortingValueType === 'direct') {
      return aValue.localeCompare(bValue);
    } else if (sortingValueType === 'reverse') {
      return bValue.localeCompare(aValue);
    }
  });
};

export const numeralSorting = (
  itemList: Request[],
  sortingCol: string,
  nested: number,
  sortingValueType: string
) => {
  itemList.sort((a, b): any => {
    let aValue = a[sortingCol];
    let bValue = b[sortingCol];
    if (nested === 1) {
      const splitedCol = sortingCol.split('.');
      aValue = a[splitedCol[0]];
      bValue = b[splitedCol[0]];
      aValue = aValue[splitedCol[1]];
      bValue = bValue[splitedCol[1]];
    }
    if (!aValue) {
      aValue = 0;
    }
    if (!bValue) {
      bValue = 0;
    }
    if (sortingValueType === 'direct') {
      return aValue - bValue;
    } else if (sortingValueType === 'reverse') {
      return bValue - aValue;
    }
  });
};
