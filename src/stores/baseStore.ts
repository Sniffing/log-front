export abstract class BaseStore<T> {

  public abstract save(entry: T): Promise<void>;
  public abstract fetch(): Promise<void>;

  private _shouldMock = false;

  protected get shouldMock(): boolean {
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