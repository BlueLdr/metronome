export type TimerWorkerInitRequest = {
  command: "init";
  parameters: TimerWorkerInitRequestParameters;
};
export type TimerWorkerStartRequest = {
  command: "start";
  parameters: TimerWorkerStartRequestParameters;
};

export type TimerWorkerStopRequest = {
  command: "stop";
};

export type TimerWorkerInitRequestParameters = {
  timestamp: number;
  now: number;
};

export type TimerWorkerStartRequestParameters = {
  timestamp: number;
  now: number;
  actionIfLate?: "ignore" | "error" | "execute";
  id?: string;
};

export type TimerWorkerRequest =
  | TimerWorkerInitRequest
  | TimerWorkerStartRequest
  | TimerWorkerStopRequest;

//================================================

export type TimerWorkerStartEvent = {
  type: "start";
  timestamp: number;
  interval: number;
  id: string | undefined;
};

export type TimerWorkerTimeoutEvent = {
  type: "timeout";
  timestamp: number;
  elapsed: number;
  id: string | undefined;
};

export type TimerWorkerErrorEvent = {
  type: "error";
  message: string;
  params: TimerWorkerStartRequestParameters;
};

export type TimerWorkerStopEvent = {
  type: "stop";
};

export type TimerWorkerEvent =
  | TimerWorkerStartEvent
  | TimerWorkerErrorEvent
  | TimerWorkerTimeoutEvent
  | TimerWorkerStopEvent;

export type TimerWorkerEventListener<Type extends TimerWorkerEvent["type"]> = (
  event: TimerWorkerEvent & { type: Type },
) => void;
