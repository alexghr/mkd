export type AppState = {
  document: Document | null,
  config: Config | null
};

export type Slug = string;

export type Document = {
  slug: Slug,
  text: string,
  title?: string,
  shared?: boolean
};

export type Config = {
  signalUrl: string,
  stunServers: Array<string>
};

export const initialState: AppState = {
  document: null,
  config: null
};

export default AppState;
