import { useState, useEffect } from "react";

export default function Timer() {
  const [time, setTime] = useState(0);

  function adjustTime() {
    setTime((time) => time + 1);
  }

  useEffect(() => {
    console.log(`Timer component mounted: ${Math.random()}`);
    const interval = setInterval(adjustTime, 1000);
    return () => clearInterval(interval);
  }, [adjustTime]);

  return (
    <div>
      <div>{time} seconds have passed</div>
    </div>
  );
}
