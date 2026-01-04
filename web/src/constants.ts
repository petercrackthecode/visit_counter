export const GET_BACKEND_URL = (isDev: boolean) =>
  isDev
    ? "http://localhost:5000/"
    : "https://visit-counter-686c74c1488f.herokuapp.com/";

export const POLLING_MS = 10_000;
