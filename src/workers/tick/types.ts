export type TickWorkerStartRequest = {
  command: "start";
  parameters: TickWorkerStartRequestParameters;
};
export type TickWorkerChangeRequest = {
  command: "change";
  parameters: TickWorkerStartRequestParameters;
};

export type TickWorkerStopRequest = {
  command: "stop";
};

export type TickWorkerStartRequestParameters = {
  interval: number;
};

export type TickWorkerRequest =
  | TickWorkerStartRequest
  | TickWorkerChangeRequest
  | TickWorkerStopRequest;

//================================================

export type TickWorkerStartEvent = {
  type: "start";
  interval: number;
};

export type TickWorkerChangeEvent = {
  type: "change";
  interval: number;
};

export type TickWorkerTickEvent = {
  type: "tick";
  interval: number;
};

export type TickWorkerStopEvent = {
  type: "stop";
};

export type TickWorkerEvent =
  | TickWorkerStartEvent
  | TickWorkerChangeEvent
  | TickWorkerTickEvent
  | TickWorkerStopEvent;

export type TickWorkerEventListener<Type extends TickWorkerEvent["type"]> = (
  event: TickWorkerEvent & { type: Type },
) => void;
