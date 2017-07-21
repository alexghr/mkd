export type AppState = {
  slug: Slug | null,
  isMaster: boolean
}

export type Slug = string;

export const initialState: AppState = {
  slug: null,
  isMaster: true
};

export default AppState;
