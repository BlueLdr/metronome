import type {
  TimerWorkerEvent,
  TimerWorkerEventListener,
  TimerWorkerInitRequest,
  TimerWorkerInitRequestParameters,
  TimerWorkerStartRequest,
  TimerWorkerStartRequestParameters,
  TimerWorkerStopRequest,
} from "./types";

//================================================

export class TimerWorkerApi {
  constructor() {
    this.worker = new Worker(new URL("./worker.ts", import.meta.url), {
      type: "module",
    });
    this.listeners = {
      start: new Set(),
      timeout: new Set(),
      error: new Set(),
      stop: new Set(),
    };

    this.worker.addEventListener("message", this.handleMessage);
  }

  private worker: Worker;
  private listeners: {
    [Type in TimerWorkerEvent["type"]]: Set<TimerWorkerEventListener<Type>>;
  };

  //================================================

  public init(parameters: TimerWorkerInitRequestParameters) {
    this.worker.postMessage({
      command: "init",
      parameters,
    } satisfies TimerWorkerInitRequest);
  }

  public start(parameters: TimerWorkerStartRequestParameters) {
    this.worker.postMessage({
      command: "start",
      parameters,
    } satisfies TimerWorkerStartRequest);
  }

  public stop() {
    this.worker.postMessage({
      command: "stop",
    } satisfies TimerWorkerStopRequest);
  }

  //================================================

  private isTimerWorkerEvent = <T extends TimerWorkerEvent["type"]>(
    event: MessageEvent,
  ): event is Omit<MessageEvent, "data"> & {
    data: TimerWorkerEvent & { type: T };
  } =>
    !!event.data &&
    typeof event.data === "object" &&
    typeof event.data.type === "string" &&
    event.data.type in this.listeners;

  private handleMessage = <T extends TimerWorkerEvent["type"]>(
    event: MessageEvent,
  ) => {
    if (!this.isTimerWorkerEvent<T>(event)) {
      return;
    }
    this.listeners[event.data.type].forEach((callback) => {
      callback(event.data);
    });
  };

  public on = <Type extends TimerWorkerEvent["type"]>(
    type: Type,
    listener: TimerWorkerEventListener<Type>,
  ) => {
    if (!(type in this.listeners)) {
      console.error(
        `Tried to add listener for invalid TimerWorker event type "${type}"`,
      );
      return;
    }
    this.listeners[type].add(listener);
  };

  public off = <Type extends TimerWorkerEvent["type"]>(
    type: Type,
    listener: TimerWorkerEventListener<Type>,
  ) => {
    if (!(type in this.listeners)) {
      console.error(
        `Tried to remove listener for invalid TimerWorker event type "${type}"`,
      );
      return;
    }
    this.listeners[type].delete(listener);
  };
}
