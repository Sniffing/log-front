export abstract class BaseStore<T> {

  public abstract async save(entry: T): Promise<void>;
  public abstract async fetch(): Promise<void>;

  private _shouldMock = false;

  protected get shouldMock() {
    return this._shouldMock;
  }

  constructor({mock}: BaseStoreProps) {
    if (mock && mock === 'true') {
      this._shouldMock = true;
    }
  }
}

export interface BaseStoreProps {
  mock?: string;
}