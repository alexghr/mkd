import { ActionCreator } from 'redux';
import { Slug, Config, MkdDocument, MkdDocuments, ConnectionStatus } from './state';

export type Action = ConfigActions | DocumentActions | ServerActions | ClientActions | AppActions;
export default Action;

export namespace ConfigAction {
  export const LoadConfig = 'config.load';
  export const SetConfig = 'config.set';

  export type LoadConfig = {
    type: typeof LoadConfig
  };

  export type SetConfig = {
    type: typeof SetConfig,
    payload: {
      config: Config
    }
  };

  export const loadConfig: ActionCreator<LoadConfig> = () => ({
    type: LoadConfig
  });

  export const setConfig: ActionCreator<SetConfig> = (config: Config) => ({
    type: SetConfig,
    payload: { config }
  });
}

type ConfigActions = ConfigAction.LoadConfig | ConfigAction.SetConfig;

export namespace DocumentAction {
  export const NewDocument = 'document.new';
  export const UpdateDocument = 'document.update';
  export const LoadDocument = 'document.restore';
  export const SetDocument = 'document.set';
  export const LoadAllDocuments = 'document.load-all';
  export const SetAllDocuments = 'document.set-all';
  export const ShareDocument = 'document.share';

  export type NewDocument = {
    type: typeof NewDocument,
    payload: {
      text?: string
    }
  };

  export type UpdateDocument = {
    type: typeof UpdateDocument,
    payload: {
      slug: Slug,
      document: Partial<MkdDocument>
    }
  };

  export type LoadDocument = {
    type: typeof LoadDocument,
    payload: {
      slug: Slug
    }
  };

  export type LoadAllDocuments = {
    type: typeof LoadAllDocuments
  };

  export type SetAllDocuments = {
    type: typeof SetAllDocuments,
    payload: {
      documents: MkdDocuments
    }
  };

  export type SetDocument = {
    type: typeof SetDocument,
    payload: {
      document: MkdDocument
    }
  };

  export type ShareDocument = {
    type: typeof ShareDocument,
    payload: {
      slug: Slug
    }
  };

  export const newDocument: ActionCreator<NewDocument> = (text: string) => ({
    type: NewDocument,
    payload: { text }
  });

  export const updateDocument: ActionCreator<UpdateDocument> =
    (slug: string, document: Partial<MkdDocument>) => ({
      type: UpdateDocument,
      payload: { slug, document }
    });

  export const setDocument: ActionCreator<SetDocument> =
    (document: MkdDocument) => ({
      type: SetDocument,
      payload: { document }
    });

  export const loadDocument: ActionCreator<LoadDocument> = (slug: Slug) => ({
    type: LoadDocument,
    payload: { slug }
  });

  export const shareDocument: ActionCreator<ShareDocument> = (slug: Slug) => ({
    type: ShareDocument,
    payload: { slug }
  });

  export const loadAllDocuments: ActionCreator<LoadAllDocuments> = () => ({ type: LoadAllDocuments });

  export const setAllDocuments: ActionCreator<SetAllDocuments> = (documents: MkdDocuments) => ({
    type: SetAllDocuments,
    payload: { documents }
  });
}

type DocumentActions = DocumentAction.NewDocument
  | DocumentAction.LoadDocument
  | DocumentAction.UpdateDocument
  | DocumentAction.SetDocument
  | DocumentAction.ShareDocument
  | DocumentAction.LoadAllDocuments
  | DocumentAction.SetAllDocuments;

export namespace ServerAction {
  export const ListenForClients = 'ses.server.listenForClients';
  export const Close = 'ses.server.close';

  export type ListenForClients = {
    type: typeof ListenForClients,
    payload: {
      slug: Slug
    }
  };

  export type Close = {
    type: typeof Close
  };

  export const listenForClients: ActionCreator<ListenForClients> = (slug: Slug) => ({
    type: ListenForClients,
    payload: { slug }
  });

  export const close: ActionCreator<Close> = () => ({ type: Close });
}

type ServerActions = ServerAction.ListenForClients | ServerAction.Close;

export namespace ClientAction {
  export const InitServerConnection = 'ses.client.initiateConnection';
  export const SetConnectionStatus = 'ses.client.setConnectionStatus';
  export const Close = 'ses.server.close';

  export type InitServerConnection = {
    type: typeof InitServerConnection,
    payload: {
      slug: Slug
    }
  };

  export type Close = {
    type: typeof Close
  };

  export type SetConnectionStatus = {
    type: typeof SetConnectionStatus,
    payload: {
      status: ConnectionStatus
    }
  }

  export const initServerConnection: ActionCreator<InitServerConnection> = (slug: Slug) => ({
    type: InitServerConnection,
    payload: { slug }
  });

  export const close: ActionCreator<Close> = () => ({ type: Close });

  export const setConnectionStatus: ActionCreator<SetConnectionStatus> = (status: ConnectionStatus) => ({
    type: SetConnectionStatus,
    payload: { status }
  });
}

type ClientActions = ClientAction.InitServerConnection | ClientAction.Close | ClientAction.SetConnectionStatus;

export namespace AppAction {
  export const Init = 'app.init';
  export const Close = 'app.close';

  export type Init = {
    type: typeof Init
  };

  export type Close = {
    type: typeof Close
  };

  export const init: ActionCreator<Init> = () => ({ type: Init });
  export const close: ActionCreator<Close> = () => ({ type: Close });
}

type AppActions = AppAction.Init | AppAction.Close;
