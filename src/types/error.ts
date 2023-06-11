export interface DefaultError extends Error {
  data: {
    defaultError: string
  }
}
