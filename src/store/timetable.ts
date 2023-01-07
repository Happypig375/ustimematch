import { createStore } from "@udecode/zustood";
import { nanoid } from "nanoid";
import { findItemDeep, toggleFolderVisibility } from "@utils/sortableTree";
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
    flattenedTimetablesTree: (): Timetable[] => {
      function flatten(items: TreeItems): TreeItem[] {
        return items.reduce<TreeItem[]>((acc, item) => {
          if (item.type === "FOLDER")
            return [...acc, item, ...flatten(item.children)];

          return [...acc, item];
        }, []);
      }

      const flatTree = flatten(get.timetablesTree()).filter(
        (item): item is TimetableItem => item.type === "TIMETABLE",
      );

      return flatTree.map((item) => item.timetable);
    },
    // // Note that personal timetable will be at index 0
    // combinedTimetables: (): Timetable[] => {
    //   const personalTimetable = get.personalTimetable();
    //   const timetables = get.timetables();
    //   if (!personalTimetable) return timetables;
    //   return [personalTimetable, ...timetables];
    // },
    // // Excluding personal timetable
    // getTimetableById: (timetableId: string) => {
    //   return get
    //     .timetables()
    //     .find((timetable) => timetable.config.id === timetableId);
    // },
    // // Excluding personal timetable
    // getTimetableIndexById: (timetableId: string) => {
    //   return get
    //     .timetables()
    //     .findIndex((timetable) => timetable.config.id === timetableId);
    // },
  }))
  .extendSelectors((_, get) => ({
    // Note that personal timetable will be at index 0
    combinedTimetables: (): Timetable[] => {
      const personalTimetable = get.personalTimetable();
      const timetables = get.flattenedTimetablesTree();
      if (!personalTimetable) return timetables;
      return [personalTimetable, ...timetables];
    },
    // Note that personal timetable will be at index 0
    // combinedVisibleTimetables: () => {
    //   return get
    //     .combinedTimetables()
    //     .filter((timetable) => timetable.config.visible);
    // },
  }))
  .extendSelectors((_, get) => ({
    // Note that personal timetable will be at index 0
    combinedVisibleTimetables: () => {
      return get
        .combinedTimetables()
        .filter((timetable) => timetable.config.visible);
    },
    // Including personal timetable
    // getCombinedVisibleTimetableIndexById: (timetableId: string) => {
    //   return get
    //     .combinedVisibleTimetables()
    //     .findIndex((timetable) => timetable.config.id === timetableId);
    // },
  }))
  .extendSelectors((_, get) => ({
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
