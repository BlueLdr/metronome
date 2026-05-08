import { MINUTE } from "~/utils/constants";

import { Sound } from "./sound";

import type { ISound } from "./sound";

//================================================

export interface INote {
  volume: number;
  sound: ISound;
  interval: number;
}

export class Note implements INote {
  constructor(index: number, config: INote, onInitSound?: () => void) {
    this.index = index;
    this.interval = config.interval;
    this._volume = config.volume;
    this.sound = new Sound(config.sound, onInitSound);
  }

  readonly index: number;
  readonly interval: number;
  private gainNode: GainNode | undefined = undefined;
  private sourceBuffer: AudioBuffer | undefined = undefined;

  public getNoteSourceNode = async (
    audioContext: AudioContext,
    playerVolume = 1,
    transformBuffer?: (buffer: AudioBuffer) => AudioBuffer,
  ) => {
    const sourceBuffer = await this.getSourceBuffer(audioContext);
    if (!this.gainNode) {
      this.gainNode = audioContext.createGain();
    }
    this.gainNode.gain.value =
      Sound.clampVolume(playerVolume) *
      this.volume *
      (this.sound.url.startsWith("https://gleitz.github.io") ? 2 : 1);

    const source = audioContext.createBufferSource();
    source.buffer = transformBuffer
      ? transformBuffer(sourceBuffer)
      : sourceBuffer;
    source.connect(this.gainNode).connect(audioContext.destination);
    return source;
  };

  public async getSourceBuffer(audioContext: AudioContext) {
    if (!this.sourceBuffer) {
      this.sourceBuffer = await audioContext.decodeAudioData(
        (await this.sound.getArrayBuffer()).slice(),
      );
    }

    return this.sourceBuffer;
  }

  _volume: number;
  sound: Sound;

  get volume() {
    return this._volume;
  }
  set volume(value: number) {
    this._volume = Sound.clampVolume(value);
  }

  onChangePlayerVolume(newVolume: number) {
    if (this.gainNode) {
      this.gainNode.gain.value =
        Sound.clampVolume(newVolume) *
        this.volume *
        (this.sound.url.startsWith("https://gleitz.github.io") ? 2 : 1);
    }
  }

  getDurationInMs(bpm: number, beatDivision: number) {
    const beatDuration = MINUTE / bpm;
    const beatValue = 1 / beatDivision;

    return (this.interval / beatValue) * beatDuration;
  }

  toJSON() {
    return {
      volume: this.volume,
      interval: this.interval,
      sound: this.sound,
    };
  }
}
