import { MkdDocument, MkdDocuments, Slug } from '../state';

type Docs = Record<Slug, MkdDocument>;

export function storeDocument(document: Partial<MkdDocument>) {
  if (!document.slug) {
    throw new Error();
  }

  const docs = getDocs();

  storeDocs({
    ...docs,
    [document.slug]: {
      ...docs[document.slug],
      ...document
    }
  });
}

export function restoreDocument(slug: Slug): MkdDocument {
  const docs = getDocs();
  if (docs[slug]) {
    return docs[slug];
  } else {
    throw new Error();
  }
}

export function restoreAllDocuments(): MkdDocuments {
  return getDocs();
}

export function ownsDocument(slug: Slug): boolean {
  const docs = getDocs();
  return docs[slug] ? true : false;
}

const docsKey = 'mkd.documents';

function getDocs(): Docs {
  const docsJson = localStorage.getItem(docsKey);
  return docsJson ? JSON.parse(docsJson) : {};
}

function storeDocs(docs: Docs): void {
  localStorage.setItem(docsKey, JSON.stringify(docs));
}
