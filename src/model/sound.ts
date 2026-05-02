export interface ISound {
  readonly url: string;
  readonly name: string;
  // pitch?: number;
}

export class Sound implements ISound {
  constructor(name: string, url: string, onInit?: () => void) {
    this.name = name;
    this.url = url;
    this.data = fetch(this.url).then((response) => response.arrayBuffer());
    this.data.then(onInit);
  }

  public static clampVolume(value: number) {
    return Math.max(0, Math.min(1, value));
  }

  readonly url: string;
  readonly name: string;
  // pitch?: number;
  private data: Promise<ArrayBuffer>;

  async getArrayBuffer() {
    return this.data;
  }
}
