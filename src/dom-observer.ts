const OBSERVE_OPTIONS = {
  childList: true,
  characterData: true,
  attributes: true,
  subtree: true,
  characterDataOldValue: true
};

export class DOMObserver {
  private editable: HTMLElement;
  private observer: MutationObserver;

  constructor(editable: HTMLElement) {
    this.editable = editable;
    this.observer = new MutationObserver((mutations) =>
      this.handleMutations(mutations)
    );
  }

  public start(): void {
    this.observer.observe(this.editable, OBSERVE_OPTIONS);
  }

  public stop(): void {
    const records = this.observer.takeRecords();
    this.handleMutations(records);
    this.observer.disconnect();
  }

  private handleMutations(mutations: MutationRecord[]): void {
    // tslint:disable-next-line
    console.log(mutations);
  }
}
