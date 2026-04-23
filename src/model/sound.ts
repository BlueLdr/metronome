export interface ISound {
  readonly url: string;
  readonly name: string;
  // pitch?: number;
}

export class Sound implements ISound {
  constructor(name: string, url: string, onInit?: () => void) {
    this.name = name;
    this.url = url;
    this.init().then(onInit);
  }

  private init() {
    return fetch(this.url).then(async (response) => {
      this.data = await response.arrayBuffer();
    });
  }

  public static clampVolume(value: number) {
    return Math.max(0, Math.min(1, value));
  }

  readonly url: string;
  readonly name: string;
  // pitch?: number;
  private data: ArrayBuffer | undefined = undefined;

  get arrayBuffer() {
    return this.data;
  }
}
