export type AppState = {
  documents: MkdDocuments,
  document: MkdDocument | null,
  config: Config | null
};

export type Slug = string;

export type MkdDocument = {
  slug: Slug,
  text: string,
  title?: string,
  shared?: boolean,
  createdAt: Date,
  updatedAt: Date
};

export type MkdDocuments = Record<Slug, MkdDocument>;

export type Config = {
  signalUrl: string,
  stunServers: Array<string>
};

export const initialState: AppState = {
  documents: {},
  document: null,
  config: null
};

export default AppState;
