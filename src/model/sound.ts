export interface ISound {
  readonly url: string;
  readonly name: string;
  // pitch?: number;
}

export class Sound implements ISound {
  constructor(name: string, url: string, onInit?: () => void) {
    this.name = name;
    this.url = url;
    this.data = SoundRegistry.getData(this.url);
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

class SoundRegistry {
  private static registry = new Map<string, ArrayBuffer>();

  static getData = (url: string) => {
    const existingData = this.registry.get(url);
    if (existingData) {
      return Promise.resolve(existingData.slice());
    }
    return fetch(url).then(async (response) => {
      const data = await response.arrayBuffer();
      this.registry.set(url, data);
      return data.slice();
    });
  };
}
