export const EVENT_NAMES = {
  CHAT_SEND: "chat:send_message",
  CHAT_RECEIVE: "chat:receive_message",
} as const;

export const ERROR_EVENT_NAMES = Object.fromEntries(
  Object.entries(EVENT_NAMES).map(([key, value]) => [
    `${key}_ERROR`,
    `${value}_error`,
  ])
) as {
  readonly [K in keyof typeof EVENT_NAMES as `${K}_ERROR`]: `${(typeof EVENT_NAMES)[K]}_error`;
};
