import { ActionCreator } from 'redux';
import { Slug, Config } from './state';

export type Action = ConfigActions | DocumentActions | ServerActions | ClientActions | BrowserActions;
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
      text?: string,
      title?: string
    }
  };

  export type LoadDocument = {
    type: typeof LoadDocument,
    payload: {
      slug: Slug
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
    (slug: string, params: { text?: string, title?: string }) => ({
      type: UpdateDocument,
      payload: { slug, ...params }
    });

  export const loadDocument: ActionCreator<LoadDocument> = (slug: Slug) => ({
    type: LoadDocument,
    payload: { slug }
  });

  export const shareDocument: ActionCreator<ShareDocument> = (slug: Slug) => ({
    type: ShareDocument,
    payload: { slug }
  });
}

type DocumentActions = DocumentAction.NewDocument
  | DocumentAction.UpdateDocument
  | DocumentAction.LoadDocument
  | DocumentAction.ShareDocument;

export namespace ServerAction {
  export const ListenForClients = 'ses.server.listenForClients';

  export type ListenForClients = {
    type: typeof ListenForClients,
    payload: {
      slug: Slug
    }
  };

  export const listenForClients: ActionCreator<ListenForClients> = (slug: Slug) => ({
    type: ListenForClients,
    payload: { slug }
  });
}

type ServerActions = ServerAction.ListenForClients;

export namespace ClientAction {
  export const InitServerConnection = 'ses.client.initiateConnection';

  export type InitServerConnection = {
    type: typeof InitServerConnection,
    payload: {
      slug: Slug
    }
  };

  export const initServerConnection: ActionCreator<InitServerConnection> = (slug: Slug) => ({
    type: InitServerConnection,
    payload: { slug }
  });
}

type ClientActions = ClientAction.InitServerConnection;

export namespace BrowserAction {
  export const Closing = 'browser.close';
  export type Closing = {
    type: typeof Closing
  };

  export const closing: ActionCreator<Closing> = () => ({ type: Closing });
}

type BrowserActions = BrowserAction.Closing;
