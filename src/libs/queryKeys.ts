export const queryKeys = {
  roles: {
    all: [
      "roles",
    ] as const,
    detail: (name: string) =>
      [
        "roles",
        name,
      ] as const,
  },
  auth: {
    session: [
      "auth",
      "session",
    ] as const,
  },
};
