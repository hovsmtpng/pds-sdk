import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";

export function Clock({
    className,
}: {
    className?: string;
}) {
    const [time, setTime] = useState<Dayjs>(dayjs());
    useEffect(() => {
        const interval = setInterval(() => {
            setTime((prev) => prev.add(1, "second"));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`${className} font-medium md:inline-block dark:text-white`}>
            {time.format("D MMM YYYY HH:mm:ss")}
        </div>
    );
}