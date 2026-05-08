export type Pitch =
  | `${"A" | "B" | "Bb"}0`
  | `${`${"C" | "F"}` | `${"A" | "B" | "D" | "E" | "G"}${"" | "b"}`}${1 | 2 | 3 | 4 | 5 | 6 | 7}`;

export interface ISound<Name = string> {
  readonly url: string;
  readonly name: Name;
  readonly label?: string;
  // readonly pitch?: Pitch;
}

export class Sound implements ISound {
  constructor(base: ISound, onInit?: (sound: Sound) => void) {
    this.name = base.name;
    this.url = base.url;
    this.label = base.label;
    this.data = SoundRegistry.getData(this.url);
    this.data.then(() => onInit?.(this));
  }

  public static clampVolume(value: number) {
    return Math.max(0, Math.min(1, value));
  }

  readonly url: string;
  readonly name: string;
  readonly label?: string;
  // pitch?: Pitch;
  private data: Promise<ArrayBuffer>;

  async getArrayBuffer() {
    return this.data;
  }

  toJSON(): ISound {
    return {
      name: this.name,
      url: this.url,
      ...(this.label ? { label: this.label } : {}),
    };
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
