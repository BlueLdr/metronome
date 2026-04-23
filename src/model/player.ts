import { Note } from "./note.ts";
import { Sound } from "./sound.ts";

//================================f================

const DEFAULT_VOLUME = 0.5;

export class Player {
  constructor(volume = DEFAULT_VOLUME) {
    this._initialized = false;
    this._volume = Sound.clampVolume(volume);
  }

  private ctx: AudioContext | undefined = undefined;
  private gainNode: GainNode | undefined = undefined;
  private _initialized: boolean;
  private _volume: number;

  get initialized() {
    return this._initialized;
  }

  get audioContext() {
    return this.ctx;
  }
  get volume() {
    return this._volume;
  }
  set volume(value: number) {
    this._volume = Sound.clampVolume(value);
  }

  public init() {
    if (this._initialized) {
      return;
    }
    this.ctx = new AudioContext();
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.value = this._volume;
    // play silent buffer to unlock the audio
    const node = this.ctx.createBufferSource();
    node.buffer = this.ctx.createBuffer(1, 1, 22050);
    node.start(0);
    this.gainNode.connect(this.ctx.destination);
    this._initialized = true;
  }

  public destroy() {
    this.ctx.close();
    this.gainNode.disconnect();
    this._initialized = false;
  }

  public start() {
    if (this._initialized) {
      this.ctx.resume();
    }
  }

  public stop() {
    if (this._initialized && this.ctx.state == "running") {
      this.ctx.suspend();
    }
  }

  public async scheduleNote(note: Note, timeInMs: number) {
    if (!this._initialized) {
      return;
    }

    const source = await note.getNoteSourceNode(this.audioContext);
    source.start(timeInMs / 1000);

    return source;
  }
}
