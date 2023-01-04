import { createStore } from "@udecode/zustood";
import { type Timetable } from "../types/timetable";

interface TimetableStore {
  personalTimetable: Timetable | null;
  timetables: Timetable[];
}

export const timetableStore = createStore("timetable")<TimetableStore>(
  {
    personalTimetable: null,
    timetables: [],
  },
  { devtools: { enabled: true }, persist: { enabled: true } },
)
  .extendSelectors((_, get) => ({
    // Note that personal timetable will be at index 0
    combinedTimetables: (): Timetable[] => {
      const personalTimetable = get.personalTimetable();
      const timetables = get.timetables();

      if (!personalTimetable) return timetables;
      return [personalTimetable, ...timetables];
    },
    // Excluding personal timetable
    getTimetableById: (timetableId: string) => {
      return get
        .timetables()
        .find((timetable) => timetable.config.id === timetableId);
    },
    // Excluding personal timetable
    getTimetableIndexById: (timetableId: string) => {
      return get
        .timetables()
        .findIndex((timetable) => timetable.config.id === timetableId);
    },
  }))
  .extendSelectors((_, get) => ({
    // Note that personal timetable will be at index 0
    combinedVisibleTimetables: () => {
      return get
        .combinedTimetables()
        .filter((timetable) => timetable.config.visible);
    },
  }))
  .extendSelectors((_, get) => ({
    // Including personal timetable
    getCombinedVisibleTimetableIndexById: (timetableId: string) => {
      return get
        .combinedVisibleTimetables()
        .findIndex((timetable) => timetable.config.id === timetableId);
    },
  }))
  .extendActions((set, get) => ({
    setPersonalTimetable: (timetable: Timetable | null) => {
      set.state((draft) => {
        draft.personalTimetable = timetable;
      });
    },
    addTimetable: (timetable: Timetable) => {
      set.state((draft) => {
        draft.timetables.push(timetable);
      });
    },
    deleteTimetable: (timetableId: string) => {
      set.state((draft) => {
        const idx = get.getTimetableIndexById(timetableId);
        if (idx !== -1) draft.timetables.splice(idx, 1);
      });
    },
    editTimetable: (timetable: Timetable) => {
      set.state((draft) => {
        const idx = get.getTimetableIndexById(timetable.config.id);
        if (idx !== -1) draft.timetables[idx] = timetable;
      });
    },
  }))
  .extendSelectors((_, get) => ({
    getIndent: (
      timetableId: string,
      lessonIndex: number,
      weekday: number,
      begin: string,
      end: string,
    ) => {
      // Cannot just pass timetableIndex because there are hidden timetables
      const timetableIndex =
        get.getCombinedVisibleTimetableIndexById(timetableId);

      let totalLevels = 0;
      let indentLevel = 0;

      // For tracing all overlap
      let tmpBegin = begin;
      let tmpEnd = end;

      // Finding the indent level of a specific lesson
      for (let i = get.combinedVisibleTimetables().length - 1; i >= 0; i--) {
        const lessons = get.combinedVisibleTimetables()[i]?.lessons[weekday];
        if (!lessons) continue;

        for (let j = 0; j < lessons.length; j++) {
          const lesson = lessons[j];
          if (!lesson) continue;

          let overlap = false;

          // https://stackoverflow.com/questions/13513932/algorithm-to-detect-overlapping-periods
          // String comparisoin works becuase the time is in "HH:mm"
          if (lesson.begin < tmpEnd && tmpBegin < lesson.end) {
            tmpBegin = lesson.begin;
            tmpEnd = lesson.end;

            overlap = true;

            if (i === timetableIndex) {
              tmpBegin = begin;
              tmpEnd = end;
            }

            if (i < timetableIndex) indentLevel += 1;
          }

          if (overlap) {
            totalLevels += 1;
          }
        }
      }

      // Another approach to get totalLevel
      // const totalLevels = flattenTimetables.length;

      // In case overlapping in the same timetable, although it shouldn't happen
      // Uses reverse for loop because z-index is higher for larger array index
      // tmpBegin = begin;
      // tmpEnd = end;
      // const tmpWeekday = flattenTimetables[timetableIndex]?.lessons[weekday];
      // if (!tmpWeekday) return { indentLevel, totalLevels };
      // let overlap = false;
      // for (let i = lessonIndex; i >= 0; i--) {
      //   const lesson = tmpWeekday[i];
      //   if (!lesson) continue;

      //   if (lesson.begin < tmpEnd && tmpBegin < lesson.end) {
      //     tmpBegin = lesson.begin;
      //     tmpEnd = lesson.end;

      //     overlap = true;
      //     if (i !== lessonIndex) indentLevel += 1;
      //   }
      // }
      // if (overlap) totalLevels += 1;

      return { indentLevel, totalLevels };
    },
  }));
