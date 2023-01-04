import { useTrackedStore } from "@store/index";
import Border from "./Border";
import DetailsModal from "./DetailsModal";
import Legend from "./Legend";
import Period from "./Period";
import Timeline from "./Timeline";
import Timetable from "./Timetable";

const Grid = () => {
  const rows = useTrackedStore().ui.weekViewRows();
  const cols = useTrackedStore().ui.weekViewCols();

  /* ---------- Fetch timematch when calendars change or when toggled --------- */
  // useEffect(() => {
  //   if (!showTimematch) return;
  //   getTimematch();
  // }, [showTimematch, calendars, getTimematch]);

  return (
    <div
      className="grid h-full overflow-y-auto"
      style={{
        gridTemplateRows: `auto repeat(${rows}, minmax(12px,1fr))`,
        gridTemplateColumns: `auto repeat(${cols}, minmax(0,1fr))`,
      }}
    >
      {/* Row and column size are calculated here */}
      <Legend />

      <Border />

      <Timetable />

      <Timeline />

      <DetailsModal />

      {/* Edge cases for ui testing period (hovering margin) */}
      {/* <Period begin="22:00" end="23:00" color="#555555" weekday={3} />
      <Period begin="08:00" end="10:00" color="#555555" weekday={0} />
      <Period begin="07:00" end="10:30" color="#555555" weekday={6} />
      <Period begin="20:12" end="22:59" color="#555555" weekday={0} />
      <Period begin="20:12" end="22:31" color="#555555" weekday={1} />
      <Period begin="20:00" end="22:43" color="#555555" weekday={2} /> */}

      {/* {Array.from({ length: 30 }, (_, i) => (
        <Period
          key={i}
          begin={`${i + 8}:00`}
          end={`${i + 8}:30`}
          color="#555555"
          weekday={2}
        />
      ))} */}
      {/* {Array.from({ length: 30 }, (_, i) => (
        <Period
          key={i}
          begin={`${i + 8}:30`}
          end={`${i + 9}:00`}
          color="#555555"
          weekday={2}
        />
      ))} */}
      {/* <Period begin="12:00" end="16:30" color="#555555" weekday={0} />
      <Period begin="12:00" end="16:30" color="#555555" weekday={1} />
      <Period begin="12:00" end="16:30" color="#555555" weekday={2} />
      <Period begin="12:00" end="16:30" color="#555555" weekday={3} />
      <Period begin="12:00" end="16:30" color="#555555" weekday={4} />
      <Period begin="12:00" end="16:30" color="#555555" weekday={5} />
      <Period begin="12:00" end="16:30" color="#555555" weekday={6} /> */}
    </div>
  );
};

export default Grid;
