import { MINUTE } from "../utils/constants.ts";
import { Sound } from "./sound.ts";

//================================================

export interface INote {
  volume: number;
  sound: Sound;
  interval: number;
}

export class Note implements INote {
  constructor(index: number, config: INote) {
    this.index = index;
    this.interval = config.interval;
    this._volume = config.volume;
    this.sound = config.sound;
  }

  readonly index: number;
  readonly interval: number;
  private gainNode: GainNode | undefined = undefined;
  private sourceBuffer: AudioBuffer | undefined = undefined;

  public async getNoteSourceNode(audioContext: AudioContext, playerVolume = 1) {
    if (!this.gainNode) {
      this.gainNode = audioContext.createGain();
    }
    this.gainNode.gain.value = Sound.clampVolume(playerVolume) * this.volume;

    if (!this.sourceBuffer) {
      this.sourceBuffer = await audioContext.decodeAudioData(
        this.sound.arrayBuffer.slice(),
      );
    }

    const source = audioContext.createBufferSource();
    source.buffer = this.sourceBuffer;
    source.connect(this.gainNode).connect(audioContext.destination);
    return source;
  }

  _volume: number;
  sound: Sound;

  get volume() {
    return this._volume;
  }
  set volume(value: number) {
    this._volume = Sound.clampVolume(value);
  }

  getDurationInMs(bpm: number, beatDivision: number) {
    const beatDuration = MINUTE / bpm;
    const beatValue = 1 / beatDivision;

    return (this.interval / beatValue) * beatDuration;
  }
}
