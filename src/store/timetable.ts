import { createStore } from "@udecode/zustood";
import {
  type FlattenTimetable,
  type Timetable,
  type TimetableConfig,
} from "../types/timetable";

interface TimetableStore {
  personalTimetable: Timetable | null;
  personalTimetableConfig: TimetableConfig | null;
  // One-to-one mapping of timetables and configs
  timetables: Timetable[];
  timetablesConfigs: TimetableConfig[];
}

export const timetableStore = createStore("timetable")<TimetableStore>(
  {
    personalTimetable: null,
    personalTimetableConfig: null,
    timetables: [],
    timetablesConfigs: [],
  },
  { devtools: { enabled: true }, persist: { enabled: true } },
)
  .extendActions((set) => ({
    setPersonalTimetable: (timetable: Timetable | null) => {
      set.state((draft) => {
        draft.personalTimetable = timetable;
      });
    },
    setPersonalTimetableConfig: (timetableConfig: TimetableConfig | null) => {
      set.state((draft) => {
        draft.personalTimetableConfig = timetableConfig;
      });
    },
    addTimetable: (timetable: Timetable, timetableConfig: TimetableConfig) => {
      set.state((draft) => {
        draft.timetables.push(timetable);
        draft.timetablesConfigs.push(timetableConfig);
      });
    },
    deleteTimetable: (timetableId: string) => {
      set.state((draft) => {
        const idx = draft.timetablesConfigs.findIndex(
          (config) => config.id === timetableId,
        );
        if (idx === -1) return;

        draft.timetables.splice(idx, 1);
        draft.timetablesConfigs.splice(idx, 1);
      });
    },
    editTimetable: (timetable: Timetable, timetableConfig: TimetableConfig) => {
      set.state((draft) => {
        const idx = draft.timetablesConfigs.findIndex(
          (config) => config.id === timetableConfig.id,
        );
        if (idx === -1) return;

        draft.timetables[idx] = timetable;
        draft.timetablesConfigs[idx] = timetableConfig;
      });
    },
  }))
  .extendSelectors((_, get) => ({
    // All visible timetables, with config flattened
    flattenTimetables: (): FlattenTimetable[] => {
      const timetables = get.timetables();
      const timetablesConfigs = get.timetablesConfigs();

      const filteredTimetables = timetables.reduce<FlattenTimetable[]>(
        (prev, curr, i) => {
          const config = timetablesConfigs[i];
          if (!config) return prev;

          // if (config.visible)
          prev.push({
            ...curr,
            config,
          });

          return prev;
        },
        [],
      );

      const personalTimetable = get.personalTimetable();
      const personalTimetableConfig = get.personalTimetableConfig();

      // if (!personalTimetable || !personalTimetableConfig?.visible)
      if (!personalTimetable || !personalTimetableConfig)
        return filteredTimetables;
      // Note that personal timetable will be placed at index 0
      return [
        { ...personalTimetable, config: personalTimetableConfig },
        ...filteredTimetables,
      ];
    },
  }))
  .extendSelectors((_, get) => ({
    visibleZipTimetables: () => {
      return get.flattenTimetables().filter((tb) => tb.config.visible);
    },
  }))
  .extendSelectors((_, get) => ({
    getTimetableById: (timetableId: string) => {
      return get
        .visibleZipTimetables()
        .find((timetable) => timetable.config.id === timetableId);
    },
    getIndent: (
      timetableId: string,
      lessonIndex: number,
      weekday: number,
      begin: string,
      end: string,
    ) => {
      // Cannot just pass timetableIndex because there are hidden timetables
      const timetableIndex = get
        .visibleZipTimetables()
        .findIndex(({ config }) => config?.id === timetableId);

      let totalLevels = 0;
      let indentLevel = 0;

      // For tracing all overlap
      let tmpBegin = begin;
      let tmpEnd = end;

      // Finding the indent level of a specific lesson
      for (let i = get.visibleZipTimetables().length - 1; i >= 0; i--) {
        const lessons = get.visibleZipTimetables()[i]?.lessons[weekday];
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
