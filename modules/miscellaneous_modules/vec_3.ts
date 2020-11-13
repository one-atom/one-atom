export class Vec3 {
  constructor(public x: number, public y: number, public z: number) {}

  public getAsObj(): {
    x: number;
    y: number;
    z: number;
  } {
    return {
      x: this.x,
      y: this.y,
      z: this.z,
    };
  }
}
