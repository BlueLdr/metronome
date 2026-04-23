import type {
  TickWorkerChangeEvent,
  TickWorkerChangeRequest,
  TickWorkerRequest,
  TickWorkerStartEvent,
  TickWorkerStartRequestParameters,
  TickWorkerStopEvent,
  TickWorkerTickEvent,
} from "./types";

//================================================

class TickWorker {
  interval: number;
  timer: number | undefined;

  start(options: TickWorkerStartRequestParameters) {
    this.interval = options.interval;
    this.timer = setInterval(() => this.tick(options.interval), this.interval);
    postMessage({
      type: "start",
      interval: this.interval,
    } satisfies TickWorkerStartEvent);
  }

  tick(lastInterval: number) {
    const { interval } = this;
    if (lastInterval !== interval) {
      clearInterval(this.timer);
      this.timer = setInterval(() => this.tick(interval), interval);
    }

    postMessage({
      type: "tick",
      interval,
    } satisfies TickWorkerTickEvent);
  }

  change(options: TickWorkerChangeRequest["parameters"]) {
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
    worker.change(e.data.parameters);
  } else if (e.data.command === "stop") {
    worker.stop();
  }
};
