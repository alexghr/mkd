import { Selector } from 'reselect';
import { AppState } from './state';

export const getSlug: Selector<AppState, AppState['slug']> = (state) => state.slug;
export const isMaster: Selector<AppState, AppState['isMaster']> = (state) => state.isMaster;
