export type AppState = {
  documents: MkdDocuments | null,
  document: MkdDocument | null,
  config: Config | null
};

export type Slug = string;

export type MkdDocument = {
  slug: Slug,
  text: string,
  title?: string,
  shared?: boolean
};

export type MkdDocuments = Record<Slug, MkdDocument>;

export type Config = {
  signalUrl: string,
  stunServers: Array<string>
};

export const initialState: AppState = {
  documents: null,
  document: null,
  config: null
};

export default AppState;
