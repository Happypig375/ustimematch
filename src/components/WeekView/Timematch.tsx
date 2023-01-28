import { useTheme } from "next-themes";
import { useTrackedStore } from "@store/index";
import { time12 } from "@utils/time";
import Period from "./Period";

const Timetable = () => {
  const timematch = useTrackedStore().timetable.timematch();

  const { theme } = useTheme();

  return (
    <>
      {timematch.map((weekday, weekdayIndex) => {
        return weekday.map((period) => {
          return (
            <Period
              key={`${weekdayIndex}${period.begin}${period.end}`}
              color={theme === "light" ? "#97cf9c" : "#356540"}
              weekday={weekdayIndex}
              begin={period.begin}
              end={period.end}
            >
              <div className="p-1 text-[clamp(0.65rem,1.3vw,0.75rem)] leading-none sm:p-[6px]">
                <div
                  style={{
                    color: (theme === "light" ? "#306935" : "#aaccaa") + "ee",
                  }}
                >
                  {`${time12(period.begin)} - ${time12(period.end)}`}
                </div>
              </div>
            </Period>
          );
        });
      })}
    </>
  );
};

export default Timetable;
