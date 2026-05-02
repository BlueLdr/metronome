import type {
  TimerWorkerStartRequestParameters,
  TimerWorkerRequest,
  TimerWorkerStartEvent,
  TimerWorkerTimeoutEvent,
  TimerWorkerStopEvent,
  TimerWorkerErrorEvent,
  TimerWorkerInitRequestParameters,
} from "./types";

//================================================

class TimerWorker {
  constructor() {
    this.timers = new Set();
  }

  timers: Set<{ value: number }>;
  zeroNow: number | undefined;
  zeroTimestamp: number | undefined;

  init(params: TimerWorkerInitRequestParameters) {
    this.zeroNow = params.now;
    this.zeroTimestamp = params.timestamp;
  }

  getInterval(params: TimerWorkerStartRequestParameters) {
    if (this.zeroTimestamp == null || this.zeroNow == null) {
      return -1;
    }
    const { timestamp, now } = params;
    const dateNow = Date.now();
    const drift = dateNow - now;
    const elapsed = dateNow - this.zeroNow;
    const nowTimestamp = this.zeroTimestamp + elapsed + drift;
    return timestamp - nowTimestamp;
  }

  start(params: TimerWorkerStartRequestParameters) {
    if (this.zeroNow == null || this.zeroTimestamp == null) {
      postMessage({
        type: "error",
        message: "Received TimerStart before worker is initialized",
        params,
      } satisfies TimerWorkerErrorEvent);
    }
    const startTime = Date.now();
    const interval = this.getInterval(params);
    if (
      interval < 0 &&
      (!params.actionIfLate || params.actionIfLate !== "execute")
    ) {
      if (params.actionIfLate === "error") {
        postMessage({
          type: "error",
          message: "Timestamp from TimerStart request already passed",
          params,
        } satisfies TimerWorkerErrorEvent);
      }
      return;
    }

    if (interval <= 5) {
      this.timeout(params.timestamp, startTime, params.id);
      return;
    }

    const timer = { value: -1 };
    this.timers.add(timer);
    timer.value = setTimeout(() => {
      this.timeout(params.timestamp, startTime, params.id);
      this.timers.delete(timer);
    }, interval);
    postMessage({
      type: "start",
      timestamp: params.timestamp,
      interval,
      id: params.id,
    } satisfies TimerWorkerStartEvent);
  }

  timeout(timestamp: number, startTime: number, id: string | undefined) {
    postMessage({
      type: "timeout",
      timestamp,
      elapsed: Date.now() - startTime,
      id,
    } satisfies TimerWorkerTimeoutEvent);
  }

  stop() {
    this.timers.forEach((item) => {
      clearTimeout(item.value);
    });
    this.timers.clear();
    this.zeroNow = undefined;
    postMessage({ type: "stop" } satisfies TimerWorkerStopEvent);
  }
}

const worker = new TimerWorker();

self.onmessage = function onMessage(e: MessageEvent<TimerWorkerRequest>) {
  if (e.data.command === "init") {
    worker.init(e.data.parameters);
  } else if (e.data.command === "start") {
    worker.start(e.data.parameters);
  } else if (e.data.command === "stop") {
    worker.stop();
  }
};
