export class RollingAverage {
  constructor(sampleSize: number, firstNumber: number) {
    this.numbers = [firstNumber];
    this.sampleSize = sampleSize;
    this.sum = firstNumber;
    this.avg = firstNumber
  }
  private numbers: number[];
  private sampleSize: number;
  private sum: number;
  private avg: number;

  get value() {
    return this.avg;
  }

  get count() {
    return this.numbers.length
  }

  public next(nextNumber: number): number {
    if (this.numbers.length >= this.sampleSize) {
      const oldNumber = this.numbers.shift()
      if (oldNumber != null) {
        this.sum -= oldNumber
      }
    }
    this.numbers.push(nextNumber);
    this.sum += nextNumber
    this.avg = this.sum / this.numbers.length;

    return this.avg;
  }
}
