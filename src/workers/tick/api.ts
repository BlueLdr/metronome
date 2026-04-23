import type {
  TickWorkerChangeRequest,
  TickWorkerEvent,
  TickWorkerEventListener,
  TickWorkerStartRequest,
  TickWorkerStartRequestParameters,
  TickWorkerStopRequest,
} from "./types.ts";

export class TickWorkerApi {
  constructor() {
    this.worker = new Worker(new URL("./worker.ts", import.meta.url), {
      type: "module",
    });
    this.listeners = {
      start: new Set(),
      change: new Set(),
      tick: new Set(),
      stop: new Set(),
    };

    this.worker.addEventListener("message", this.handleMessage);
  }

  private worker: Worker;
  private listeners: {
    [Type in TickWorkerEvent["type"]]: Set<TickWorkerEventListener<Type>>;
  };

  //================================================

  public start(parameters: TickWorkerStartRequestParameters) {
    this.worker.postMessage({
      command: "start",
      parameters,
    } satisfies TickWorkerStartRequest);
  }
  public change(parameters: TickWorkerChangeRequest["parameters"]) {
    this.worker.postMessage({
      command: "change",
      parameters,
    } satisfies TickWorkerChangeRequest);
  }
  public stop() {
    this.worker.postMessage({
      command: "stop",
    } satisfies TickWorkerStopRequest);
  }

  //================================================

  private isTickWorkerEvent = (
    event: MessageEvent,
  ): event is Omit<MessageEvent, "data"> & { data: TickWorkerEvent } =>
    !!event.data &&
    typeof event.data === "object" &&
    typeof event.data.type === "string" &&
    event.data.type in this.listeners;

  private handleMessage = (event: MessageEvent) => {
    if (!this.isTickWorkerEvent(event)) {
      return;
    }
    this.listeners[event.data.type].forEach((callback) => {
      callback(event.data);
    });
  };

  public on = <Type extends TickWorkerEvent["type"]>(
    type: Type,
    listener: TickWorkerEventListener<Type>,
  ) => {
    if (!(type in this.listeners)) {
      console.error(
        `Tried to add listener for invalid TickWorker event type "${type}"`,
      );
      return;
    }
    this.listeners[type].add(listener);
  };

  public off = <Type extends TickWorkerEvent["type"]>(
    type: Type,
    listener: TickWorkerEventListener<Type>,
  ) => {
    if (!(type in this.listeners)) {
      console.error(
        `Tried to remove listener for invalid TickWorker event type "${type}"`,
      );
      return;
    }
    this.listeners[type].delete(listener);
  };
}
