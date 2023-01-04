import { actions, store, useTrackedStore } from "@store/index";
import Event from "./Event";

const Timetable = () => {
  const flattenTimetables = useTrackedStore().timetable.flattenTimetables();
  const getIndent = store.timetable.getIndent;
  const setOpenDetails = actions.weekView.setOpenDetails;
  const setDetailsTimetable = actions.weekView.setDetailsTimetable;
  const setdetailsLesson = actions.weekView.setDetailsLesson;

  return (
    <>
      {flattenTimetables.map((timetable) => {
        // Don't use visibleZipTimetables here because it will cause re-render when toggling visibility,
        // which removes the indent transition.
        if (!timetable.config.visible) return null;

        return timetable.lessons.map((weekday, weekdayIndex) => {
          return weekday.map((lesson, lessonIndex) => {
            return (
              <Event
                key={`${timetable.config.id}${weekdayIndex}${lessonIndex}`}
                weekday={weekdayIndex}
                lesson={lesson}
                color={timetable.config.color}
                onClick={() => {
                  setDetailsTimetable(timetable);
                  setdetailsLesson(lesson);
                  setOpenDetails(true);
                }}
                indent={getIndent(
                  timetable.config.id,
                  lessonIndex,
                  weekdayIndex,
                  lesson.begin,
                  lesson.end,
                )}
              />
            );
          });
        });
      })}
    </>
  );
};

export default Timetable;
