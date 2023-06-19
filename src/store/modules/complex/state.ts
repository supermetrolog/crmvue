export interface IComplexState {
  complexObjects: IComplexObject[];
}

export interface IComplexObject extends Record<string, any> {}

export const state: IComplexState = {
  complexObjects: [],
};
