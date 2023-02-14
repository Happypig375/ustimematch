import timetable from "../fixtures/timetable.json";
import timetableStore from "../fixtures/timetableStore.json";

describe("share", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.dataCy("tour-skip").click();
  });

  it("display empty message correctly", () => {
    cy.dataCy("share-open").click();
    cy.dataCy("share-empty").should(
      "have.text",
      "No timetables have been added.",
    );

    cy.actions("timetable", "addFolder", "test");
    cy.dataCy("share-empty").should(
      "have.text",
      "No timetables have been added.",
    );

    cy.actions("timetable", "addTimetable", timetable);
    cy.dataCy("share-empty").should("not.exist");
  });

  it("display tree correctly with personal timetable", () => {
    cy.actions("timetable", "state", () => timetableStore);
    cy.dataCy("share-open").click();

    [
      "Timetable 0",
      "Timetable 1",
      "Folder 1",
      "Timetable 2",
      "Timetable 3",
      "Folder 2",
      "Folder 3",
      "Timetable 4",
      "Folder 5",
      "Timetable 5",
      "Folder 6",
      "Timetable 6",
    ].forEach((name, i) => {
      cy.dataCy(`share-select-item-${i}`).should("have.text", name);
    });
  });

  it("display tree correctly without personal timetable", () => {
    cy.actions("timetable", "state", () => ({
      ...timetableStore,
      personalTimetable: null,
    }));
    cy.dataCy("share-open").click();

    [
      "Timetable 1",
      "Folder 1",
      "Timetable 2",
      "Timetable 3",
      "Folder 2",
      "Folder 3",
      "Timetable 4",
      "Folder 5",
      "Timetable 5",
      "Folder 6",
      "Timetable 6",
    ].forEach((name, i) => {
      cy.dataCy(`share-select-item-${i}`).should("have.text", name);
    });
  });

  it("can share and receive with duplication warning", () => {
    cy.actions("timetable", "state", () => timetableStore);
    cy.dataCy("share-open").click();

    cy.dataCy("share-select-item-0").click();
    cy.dataCy("share-select-item-1").click();
    cy.dataCy("share-select-item-2").click();

    cy.dataCy("share-continue").click();
    cy.dataCy("share-url")
      .invoke("val")
      .then((url) => {
        if (typeof url !== "string")
          throw new Error("Type of share url not equals string.");
        cy.visit(url);
      });

    ["Timetable 0", "Timetable 1", "Timetable 2", "Timetable 3"].forEach(
      (name, i) => {
        cy.dataCy(`share-receive-select-item-${i}`).should(
          "have.text",
          name + "Duplicated",
        );
      },
    );
  });
});
