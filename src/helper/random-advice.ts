import { clearLine } from "node:readline";

interface RandomAdviceResponse {
  slip: {
    id: number;
    advice: string;
  };
}

export async function getRandomAdvice(signal: AbortSignal) {
  const url = "https://api.adviceslip.com/advice";
  let timerNextInterval: NodeJS.Timeout | undefined = undefined;

  const data = (await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    signal,
  })
    .then((res) => res.json())
    .catch((err: Error) => {
      if (err.name === "AbortError" || err.name === "ETIMEDOUT") {
        return;
      } else {
        throw err;
      }
    })) as RandomAdviceResponse | undefined;

  if (data !== undefined) {
    clearLine(process.stdout, 1);
    process.stdout.write(` - "${data.slip.advice}"`);
  }

  if (signal.aborted) {
    clearTimeout(timerNextInterval);
    return;
  } else {
    clearTimeout(timerNextInterval);
    timerNextInterval = setTimeout(() => {
      getRandomAdvice(signal);
    }, 20000);
  }
}
