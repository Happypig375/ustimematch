import { useTrackedStore } from "@store/index";
import { textColor } from "@utils/color";
import { parseTime } from "@utils/time";
import Period from "./Period";

const Timetable = () => {
  const timematch = useTrackedStore().timetable.timematch();

  return (
    <>
      {timematch.map((weekday, weekdayIndex) => {
        return weekday.map((period) => {
          return (
            <Period
              key={`${weekdayIndex}${period.begin}${period.end}`}
              color="#97cf9c"
              weekday={weekdayIndex}
              begin={period.begin}
              end={period.end}
            >
              <div className="p-1 text-[clamp(0.65rem,1.3vw,0.75rem)] leading-none sm:p-[6px]">
                <div style={{ color: textColor("#97cf9c") + "ee" }}>
                  {`${parseTime(period.begin)} - ${parseTime(period.end)}`}
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
