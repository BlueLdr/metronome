import { Note } from "./note";
import { Sound } from "./sound";

import type {
  Measure,
  MeasureNoteWithSource,
  MeasureWithSources,
} from "./measure";

//================================================

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
    if (this._initialized && this.gainNode) {
      this.gainNode.gain.value = this._volume;
    }
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
    this.ctx?.close();
    this.gainNode?.disconnect();
    this._initialized = false;
  }

  public start() {
    if (this._initialized) {
      this.ctx?.resume();
    }
  }

  public stop() {
    if (this._initialized && this.ctx?.state == "running") {
      this.ctx?.suspend();
    }
  }

  public async scheduleNote(note: Note, timeInMs: number) {
    if (!this._initialized || !this.ctx) {
      return;
    }

    const source = await note.getNoteSourceNode(this.ctx, this._volume);
    source.start(timeInMs / 1000);

    return source;
  }

  public async getSourcesForMeasure(
    measure: Measure,
  ): Promise<MeasureWithSources> {
    const ctx = this.ctx;
    if (!this._initialized || !ctx) {
      return Promise.reject(
        new Error(
          "[Player] Tried to get sources for measure before initializing player",
        ),
      );
    }
    return Promise.allSettled(
      measure.notes.map((sNote) =>
        sNote.note
          .getNoteSourceNode(ctx, this._volume, (buffer) => {
            const newBufferLength = (measure.duration / 1000) * ctx.sampleRate;
            if (newBufferLength < buffer.length) {
              return buffer;
            }
            const newBuffer = ctx.createBuffer(
              buffer.numberOfChannels,
              newBufferLength,
              buffer.sampleRate,
            );
            for (let i = 0; i < buffer.numberOfChannels; i++) {
              const data = buffer.getChannelData(i);
              const newData = newBuffer.getChannelData(i);
              newData.set(data, 0);
            }
            return newBuffer;
          })
          .then(
            (source): MeasureNoteWithSource => ({
              ...sNote,
              source,
            }),
          ),
      ),
    ).then((results) => {
      const notes: MeasureNoteWithSource[] = [];
      const failed: PromiseRejectedResult[] = [];
      results.forEach((result) => {
        if (result.status === "rejected") {
          failed.push(result);
        } else {
          notes.push(result.value);
        }
      });

      if (failed.length > 0) {
        notes.forEach((note) => note.source.stop());
        return Promise.reject(
          new Error(
            "[Player] Some notes in the measure failed to initialize source nodes",
          ),
        );
      }

      return {
        ...measure,
        notes,
      };
    });
  }
}
