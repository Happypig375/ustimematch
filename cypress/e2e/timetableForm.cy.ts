import timetable from "../fixtures/timetable.json";

describe("timetable form validity", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.dataCy("tour-skip").click();
    cy.dataCy("add-timetable").click();
  });

  it("throws error on empty name", () => {
    cy.timetableForm();

    cy.dataCy("input-error-name").should("contain.text", "Please enter a name");
  });

  it("throws error on long name", () => {
    cy.timetableForm("12345678901234567890123456789012345678901");

    cy.dataCy("input-error-name").should(
      "contain.text",
      "The name is too long",
    );
  });

  it("trims name", () => {
    cy.timetableForm(" trim ", timetable.plannerURL);

    cy.store("timetable", "timetablesTree")
      .its(0)
      .its("timetable")
      .its("name")
      .should("eq", "trim");
  });

  it("throws error on empty planner url", () => {
    cy.timetableForm();
    cy.dataCy("input-error-planner-url").should(
      "contain.text",
      "Invalid planner URL",
    );
  });

  it("throws error on invalid planner url", () => {
    cy.timetableForm(undefined, "https://random.url");

    cy.dataCy("input-error-planner-url").should(
      "contain.text",
      "Invalid planner URL",
    );

    cy.timetableForm(undefined, "invalid url");

    cy.dataCy("input-error-planner-url").should(
      "contain.text",
      "Invalid planner URL",
    );
  });
});

describe("timetable form actions", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.dataCy("tour-skip").click();
    cy.dataCy("add-timetable").click();
    cy.timetableForm(timetable.name, timetable.plannerURL);
  });

  it("can add", () => {
    cy.store("timetable", "timetablesTree")
      .its(0)
      .its("timetable")
      .its("name")
      .should("eq", timetable.name);
    cy.store("timetable", "timetablesTree")
      .its(0)
      .its("timetable")
      .its("plannerURL")
      .should("eq", timetable.plannerURL);
  });

  it("can edit", () => {
    cy.dataCy("sortable-tree-item").click();
    cy.timetableForm(" edited");

    cy.store("timetable", "timetablesTree")
      .its(0)
      .its("timetable")
      .its("name")
      .should("eq", timetable.name + " edited");
  });

  it("can delete", () => {
    cy.dataCy("sortable-tree-item").click();
    cy.dataCy("delete-alert-trigger").click();
    cy.dataCy("delete-alert-delete").click();

    cy.store("timetable", "timetablesTree").its("length").should("eq", 0);
  });
});
