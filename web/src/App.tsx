import "./index.css";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { GET_BACKEND_URL, POLLING_MS } from "./constants";

export interface VisitCounterResp {
  ok: boolean;
  visitors: number;
  errorMessage: string | undefined;
}

export function App() {
  const isDev =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";
  const BACKEND_URL = GET_BACKEND_URL(isDev);
  const [visitCnt, setVisitCnt] = useState<number | undefined>(undefined);
  // to prevent double-calling the endpoint in React StrictMode (only in development)
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    axios
      .post(BACKEND_URL + "/visitor")
      .then((resp) => {
        const data: VisitCounterResp = resp.data;
        if (!data.ok) {
          throw new Error(data.errorMessage);
        }

        setVisitCnt(data.visitors);
      })
      .catch((err) => {
        switch (err.response.status) {
          case 429:
            // got rate-limited => simply fetch the visit count to get the number
            fetchVisitCnt();
            break;
          default:
            console.log("error incrementing the visit count: ", err);
        }
      });
  }, []);

  useEffect(() => {
    // poll the visit count every [POLLING_MS] to get the most up-to-date visitor count
    const intervalId = setInterval(fetchVisitCnt, POLLING_MS);

    return () => clearInterval(intervalId);
  });

  const fetchVisitCnt = () => {
    axios
      .get(BACKEND_URL + "/visitor")
      .then((resp) => {
        const data: VisitCounterResp = resp.data;
        if (!data.ok) {
          throw new Error(data.errorMessage);
        }

        setVisitCnt(data.visitors);
      })
      .catch((err) => {
        console.log("error getting the visit count: ", err);
      });
  };

  return (
    <div className="app">
      <h1 className="text-sky-500">
        {visitCnt === undefined
          ? "Loading..."
          : `The number of visitors is ${visitCnt}`}
      </h1>
    </div>
  );
}

export default App;
