interface Vector {
  getAsObj: () => {
    x: number;
    y: number;
  };
}

export class Vec2 implements Vector {
  constructor(public x: number, public y: number) {}

  public getAsObj() {
    return {
      x: this.x,
      y: this.y,
    };
  }
}
