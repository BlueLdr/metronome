import { MINUTE } from "~/utils/constants";
import { getNoteInterval } from "~/utils/helpers";

import { Sound } from "./sound";

import type { NoteDivision } from "~/utils/types";
import type { ISound } from "./sound";

//================================================

export interface INote {
  volume: number;
  sound: ISound;
  division: NoteDivision;
  tuplet?: number;
  dotted?: 0 | 1 | 2;
}

export class Note implements INote {
  constructor(index: number, config: INote, onInitSound?: () => void) {
    this.index = index;
    this.division = config.division;
    this._volume = config.volume;
    this.sound = new Sound(config.sound, onInitSound);
    this.tuplet = config.tuplet;
    this.dotted = config.dotted;
  }

  readonly index: number;
  readonly division: NoteDivision;
  readonly tuplet?: number;
  readonly dotted?: INote["dotted"];
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

    return (getNoteInterval(this) / beatValue) * beatDuration;
  }

  get interval() {
    return getNoteInterval(this);
  }

  toJSON() {
    return {
      volume: this.volume,
      division: this.division,
      sound: this.sound,
      tuplet: this.tuplet,
      dotted: this.dotted || undefined,
    };
  }
}
