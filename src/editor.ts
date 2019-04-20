export class Editor {
  private place: Element;

  constructor(place: Element) {
    this.place = place;
  }

  getName(): string {
    return 'winternote';
  }
}
