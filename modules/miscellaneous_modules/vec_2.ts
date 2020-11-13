export class Vec2 {
  constructor(public x: number, public y: number) {}

  public getAsObj(): {
    x: number;
    y: number;
  } {
    return {
      x: this.x,
      y: this.y,
    };
  }
}
