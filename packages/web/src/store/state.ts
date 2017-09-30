export type AppState = {
  documents: MkdDocuments,
  document: MkdDocument | null,
  config: Config | null,
  connectionStatus: ConnectionStatus
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

export type ConnectionStatus = 'none' | 'open' | 'connecting' | 'error';

export const initialState: AppState = {
  documents: {},
  document: null,
  config: null,
  connectionStatus: 'none'
};

export default AppState;
