export type Keybind = Pick<KeyboardEvent, "key"> &
  Partial<Pick<KeyboardEvent, "altKey" | "ctrlKey" | "metaKey" | "shiftKey">>;

export type KeybindSettings = {
  [K in KeybindAction]: Keybind[];
};

export enum KeybindAction {
  PlayPause = "PlayPause",
  BpmUp = "BpmUp",
  BpmDown = "BpmDown",
  BpmJumpUp = "BpmJumpUp",
  BpmJumpDown = "BpmJumpDown",
  VolumeUp = "VolumeUp",
  VolumeDown = "VolumeDown",
  VolumeJumpUp = "VolumeJumpUp",
  VolumeJumpDown = "VolumeJumpDown",
  TapTempo = "TapTempo",
}
