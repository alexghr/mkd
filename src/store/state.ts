export type AppState = {
  document: Document | null,
  documents: Array<Document>
}

export type Slug = string;

export type Document = {
  slug: Slug,
  text: string
};

export const initialState: AppState = {
  documents: [],
  document: null
};

export default AppState;
