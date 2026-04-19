import type {
  TickWorkerChangeEvent,
  TickWorkerChangeRequest,
  TickWorkerRequest,
  TickWorkerStartEvent,
  TickWorkerStartRequestParameters,
  TickWorkerStopEvent,
  TickWorkerTickEvent,
} from "./types.ts";

//================================================

class TickWorker {
  interval: number;
  timer: number | undefined;

  start(options: TickWorkerStartRequestParameters) {
    this.interval = options.interval;
    this.timer = setInterval(() => this.tick(), this.interval);
    postMessage({
      type: "start",
      interval: this.interval,
    } satisfies TickWorkerStartEvent);
  }

  tick() {
    const { interval } = this;
    postMessage({
      type: "tick",
      interval,
    } satisfies TickWorkerTickEvent);
  }

  update(options: TickWorkerChangeRequest["parameters"]) {
    this.interval = options.interval;
    postMessage({
      type: "change",
      interval: this.interval,
    } satisfies TickWorkerChangeEvent);
  }

  stop() {
    clearInterval(this.timer);
    this.timer = undefined;
    postMessage({ type: "stop" } satisfies TickWorkerStopEvent);
  }
}

const worker = new TickWorker();

self.onmessage = function onMessage(e: MessageEvent<TickWorkerRequest>) {
  if (e.data.command === "start") {
    worker.start(e.data.parameters);
  } else if (e.data.command === "change") {
    worker.update(e.data.parameters);
  } else if (e.data.command === "stop") {
    worker.stop();
  }
};
