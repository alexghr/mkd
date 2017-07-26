import { Document, Slug } from '../state';

type Docs = Record<Slug, Document>

export function storeDocument(document: Document) {
  const docs = {
    ...getDocs(),
    [document.slug]: document
  };

  storeDocs(docs);
}

export function restoreDocument(slug: Slug): Document {
  const docs = getDocs();
  if (docs[slug]) {
    return docs[slug];
  } else {
    throw new Error();
  }
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
