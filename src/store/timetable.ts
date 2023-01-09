import { createStore } from "@udecode/zustood";
import { nanoid } from "nanoid";
import {
  findItemDeep,
  findTimetableByIdDeep,
  rawFlatten,
  toggleFolderVisibility,
} from "@utils/sortableTree";
import type { Period, Periods } from "../types/timetable";
import { type Timetable } from "../types/timetable";
import type { TimetableItem, TreeItems, TreeItem } from "../types/tree";

interface TimetableStore {
  personalTimetable: Timetable | null;
  timetablesTree: TreeItems;
}

// For future reference if implementing hydrate store from database
// https://github.com/pmndrs/zustand/issues/405#issuecomment-1371261446
export const timetableStore = createStore("timetable")<TimetableStore>(
  {
    personalTimetable: null,
    timetablesTree: [],
  },
  { devtools: { enabled: true }, persist: { enabled: true } },
)
  .extendSelectors((_, get) => ({
    // All timetables within tree
    flattenedTimetablesTree: (): Timetable[] => {
      return rawFlatten(get.timetablesTree())
        .filter((item): item is TimetableItem => item.type === "TIMETABLE")
        .map((item) => item.timetable);
    },
  }))
  .extendSelectors((_, get) => ({
    // All timetables within tree including personal timetable
    // Note that personal timetable will be at index 0
    combinedTimetables: (): Timetable[] => {
      const personalTimetable = get.personalTimetable();
      const timetables = get.flattenedTimetablesTree();
      if (!personalTimetable) return timetables;
      return [personalTimetable, ...timetables];
    },
  }))
  .extendSelectors((_, get) => ({
    // All visible timetables
    combinedVisibleTimetables: () => {
      return get
        .combinedTimetables()
        .filter((timetable) => timetable.config.visible);
    },
  }))
  .extendSelectors((_, get) => ({
    getCombinedVisibleTimetableIndexById: (timetableId: string) => {
      return get
        .combinedVisibleTimetables()
        .findIndex((timetable) => timetable.config.id === timetableId);
    },
    // Inverted time periods of all visible timetables
    timematch: (): Periods => {
      const timetables = get.combinedVisibleTimetables();

      const timematchPeriods: Periods = [[], [], [], [], [], [], []];

      for (const timetable of timetables) {
        for (const [weekdayIndex, weekday] of timetable.lessons.entries()) {
          // Map into periods
          timematchPeriods[weekdayIndex]?.push(
            ...weekday.map(({ begin, end }) => ({
              begin,
              end,
            })),
          );
        }
      }

      for (const [weekdayIndex, weekday] of timematchPeriods.entries()) {
        // Sort with regards to beginning time in case if they aren't already
        weekday.sort((a, b) => a.begin.localeCompare(b.begin));

        // Merge overlapping periods
        // https://leetcode.com/problems/merge-intervals
        // https://stackoverflow.com/questions/60937883/merge-overlapping-date-ranges
        let newWeekday = weekday.reduce<Period[]>((acc, curr) => {
          // Push first element into acc
          if (acc.length === 0) return [curr];

          // Pop the pervious element for comparison
          const prev = acc.pop();
          if (!prev) return acc;

          // If prev and curr overlap
          if (curr.begin <= prev.end)
            // Returns the larger end
            return curr.end <= prev.end
              ? [...acc, prev]
              : [...acc, { begin: prev.begin, end: curr.end }];

          // Non-intersecting periods
          return [...acc, prev, curr];
        }, []);

        // Invert periods
        newWeekday = newWeekday.reduce<[Period[], string]>(
          ([acc, prevEnd], { begin, end }) => {
            return begin > prevEnd
              ? [[...acc, { begin: prevEnd, end: begin }], end]
              : [acc, prevEnd];
          },
          [[], "00:00"],
        )[0];

        // Extend last period to end of date
        const lastEnd = weekday[weekday.length - 1]?.end;
        if (lastEnd) newWeekday.push({ begin: lastEnd, end: "23:59" });

        // Check for empty weekday
        if (newWeekday.length === 0)
          newWeekday.push({ begin: "00:00", end: "23:59" });

        timematchPeriods[weekdayIndex] = newWeekday;
      }

      return timematchPeriods;
    },
  }))
  .extendActions((set, get) => ({
    setPersonalTimetable: (timetable: Timetable | null) => {
      set.state((draft) => {
        draft.personalTimetable = timetable;
      });
    },
    // Add folder to tree by name and color
    addFolder: (name: string) => {
      set.state((draft) => {
        draft.timetablesTree.push({
          name,
          id: nanoid(),
          type: "FOLDER",
          collapsed: false,
          children: [],
        });
      });
    },
    setTimetablesTree: (treeItems: TreeItems) => {
      set.state((draft) => {
        draft.timetablesTree = treeItems;
      });
    },
    // Add timetable to tree
    addTimetable: (timetable: Timetable) => {
      set.state((draft) => {
        draft.timetablesTree.push({
          timetable,
          id: nanoid(),
          type: "TIMETABLE",
        });
      });
    },

    // Either folder or timetable by their id
    removeTreeItem: (id: string) => {
      const removeItem = (items: TreeItems, id: string) => {
        const newItems = [];

        for (const item of items) {
          if (item.id === id) continue;

          if (item.type === "FOLDER" && item.children.length)
            item.children = removeItem(item.children, id);

          newItems.push(item);
        }

        return newItems;
      };

      set.state((draft) => {
        draft.timetablesTree = removeItem(get.timetablesTree(), id);
      });
    },
    // Edit either folder or timetable by tree id
    editTreeItem: (id: string, newItem: TreeItem) => {
      function edit(items: TreeItems, id: string, newItem: TreeItem) {
        const newItems: TreeItems = [];

        for (const item of items) {
          if (item.id === id && item.type === newItem.type) {
            newItems.push(newItem);
            continue;
          }

          if (item.type === "FOLDER" && item.children.length)
            item.children = edit(item.children, id, newItem);

          newItems.push(item);
        }

        return newItems;
      }

      set.state((draft) => {
        draft.timetablesTree = edit(get.timetablesTree(), id, newItem);
      });
    },
  }))
  .extendActions((set, get) => ({
    editTimetable: (timetable: Timetable) => {
      const timetableItem = findTimetableByIdDeep(
        get.timetablesTree(),
        timetable.config.id,
      );
      if (!timetableItem) return;

      console.log(timetableItem);

      set.editTreeItem(timetableItem.id, { ...timetableItem, timetable });
    },
    // Toggle visibility of folder or timetable
    toggleVisibility: (id: string) => {
      const item = findItemDeep(get.timetablesTree(), id);
      if (!item) return;

      if (item.type === "TIMETABLE")
        set.editTreeItem(id, {
          ...item,
          timetable: {
            ...item.timetable,
            config: {
              ...item.timetable.config,
              visible: !item.timetable.config.visible,
            },
          },
        });

      if (item.type === "FOLDER")
        set.editTreeItem(item.id, toggleFolderVisibility(item));
    },
    toggleFolderCollapse: (id: string) => {
      const folderItem = findItemDeep(get.timetablesTree(), id);
      if (!folderItem || folderItem.type !== "FOLDER") return;

      set.editTreeItem(id, { ...folderItem, collapsed: !folderItem.collapsed });
    },
  }))
  .extendSelectors((_, get) => ({
    // Indentation for weekview, to prevent overlapping events
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
