import { useDate } from "@hooks/useCurrentTime";

type Props = {
  gridHour: number[];
  minuteHeight: number;
};

const Timeline = ({ gridHour, minuteHeight }: Props) => {
  const { date } = useDate();

  // const { showWeekend } = useStore((state) => ({
  //   showWeekend: state.showWeekend,
  // }));
  const showWeekend = true;
  const weekday = (date.getDay() + 6) % 7;

  // 1-indexed grid + 1 col time
  const gridColumnStart = weekday + 2;

  const minSinceBegin =
    (date.getHours() - (gridHour[0] as number)) * 60 + date.getMinutes();

  const overflow =
    (gridHour[0] as number) > date.getHours() ||
    (gridHour[gridHour.length - 1] as number) < date.getHours() ||
    (!showWeekend && weekday > 4);

  return (
    <>
      {!overflow && (
        <div
          className={`${
            // prevent initial flash
            minuteHeight ? "visible" : "hidden"
          } pointer-events-none relative z-[5] -ml-[3px] overflow-y-hidden md:-ml-[4px]`}
          style={{
            gridColumnStart,
            gridRow: "2/-1",
          }}
        >
          <div
            style={{ top: minSinceBegin * minuteHeight }}
            className="bg-midnight-blue absolute -mt-[1.25px] h-[2.5px] w-full rounded-full md:-mt-[1.5px] md:h-[3px]"
          />

          <div
            style={{ top: minSinceBegin * minuteHeight }}
            className="bg-midnight-blue absolute -mt-[3px] h-[6px] w-[6px] rounded-full md:-mt-[4px] md:h-[8px] md:w-[8px]"
          />
        </div>
      )}
    </>
  );
};

export default Timeline;
