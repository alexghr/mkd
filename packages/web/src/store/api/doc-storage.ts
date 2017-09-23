import { MkdDocument, MkdDocuments, Slug } from '../state';

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
  const doc = docs[slug];
  if (doc) {
    return mapDocFromStorage(doc as SerializedMkdDocument);
  } else {
    throw new Error();
  }
}

export function restoreAllDocuments(): MkdDocuments {
  const docs = getDocs();
  return Object.keys(docs)
    .map(slug => mapDocFromStorage(docs[slug]))
    .reduce((accum, doc) => {
      accum[doc.slug] = doc;
      return accum;
    }, {})
}

export function ownsDocument(slug: Slug): boolean {
  const docs = getDocs();
  return docs[slug] ? true : false;
}

const docsKey = 'mkd.documents';

function getDocs(): SerializedMkdDocuments {
  const docsJson = localStorage.getItem(docsKey);
  return docsJson ? JSON.parse(docsJson) : {};
}

function storeDocs(docs: MkdDocuments | SerializedMkdDocuments): void {
  localStorage.setItem(docsKey, JSON.stringify(docs));
}

function mapDocFromStorage(doc: SerializedMkdDocument): MkdDocument {
  return {
    ...doc,
    createdAt: new Date(doc.createdAt),
    updatedAt: new Date(doc.updatedAt)
  }
}

type SerializedMkdDocument = MkdDocument & { createdAt: string, updatedAt: string};
type SerializedMkdDocuments = Record<string, SerializedMkdDocument>;
