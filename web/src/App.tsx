import "./index.css";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import {
  AUTHOR_GITHUB_URL,
  GET_BACKEND_URL,
  POLLING_MS,
  REPO_URL,
} from "./constants";
import { motion } from "motion/react";
import { FlipCounter } from "./components/FlipCounter";
import { Github } from "lucide-react";

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
    <div className="app min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 mb-6"
        >
          <div className="text-center mb-8">
            <h1 className="text-gray-100 mb-2 text-2xl font-bold">
              Total Visits
            </h1>
            <div className="flex justify-center my-8">
              <FlipCounter value={visitCnt ?? 0} minDigits={6} />
            </div>

            <div
              className={`
            decorative-line w-full h-1 bg-gradient-to-r 
            from-indigo-500 via-purple-500 to-pink-500 rounded-full my-8
            `}
            />

            <p className="text-gray-400 text-xl mx-1">
              Built by{" "}
              <motion.button
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.5 },
                }}
                transition={{ duration: 0.5 }}
              >
                <a href={AUTHOR_GITHUB_URL} target="_blank">
                  @petercrackthecode
                </a>
              </motion.button>{" "}
              in California.
            </p>
          </div>

          <a
            href={REPO_URL}
            target="_blank"
            className={`
              absolute bottom-6 right-6 inline-flex items-center 
              gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg transition-colors group
              `}
          >
            <Github className="w-4 h-4 text-gray-400 group-hover:text-gray-200 transition-colors" />
            <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">
              Fork on Github
            </span>
          </a>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
