export interface Factory<TModule> {
  create(): TModule;
}
