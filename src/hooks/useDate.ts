import { useEffect, useState } from "react";

const useDate = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setDate(new Date()), 10000);

    return () => clearInterval(interval);
  }, []);

  return { date };
};

export default useDate;
