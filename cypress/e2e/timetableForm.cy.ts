import timetable from "../fixtures/timetable.json";

describe("timetable form validity", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.get('[data-cy="add-timetable"]').click();
  });

  it("throws error on empty name", () => {
    cy.get('[data-cy="timetable-form"]').submit();
    cy.get('[data-cy="input-label-name"]').should(
      "contain.text",
      "Please enter a name",
    );
  });

  it("throws error on long name", () => {
    cy.get('[data-cy="timetable-form-name-input"]').type(
      "12345678901234567890123456789012345678901",
    );
    cy.get('[data-cy="timetable-form"]').submit();
    cy.get('[data-cy="input-label-name"]').should(
      "contain.text",
      "The name is too long",
    );
  });

  it("trims name", () => {
    cy.get('[data-cy="timetable-form-name-input"]').type(" trim ");
    cy.get('[data-cy="timetable-form-planner-url-input"]')
      .focus()
      .type(timetable.plannerURL);
    cy.get('[data-cy="timetable-form"]').submit();

    cy.window()
      .its("store")
      .its("timetable")
      .invoke("timetablesTree")
      .its(0)
      .its("timetable")
      .its("name")
      .should("eq", "trim");
  });

  it("throws error on empty planner url", () => {
    cy.get('[data-cy="timetable-form"]').submit();
    cy.get('[data-cy="input-label-planner-url"]').should(
      "contain.text",
      "Invalid planner URL",
    );
  });

  it("throws error on invalid planner url", () => {
    cy.get('[data-cy="timetable-form-planner-url-input"]')
      .focus()
      .type("https://wrong.url");

    cy.get('[data-cy="timetable-form"]').submit();
    cy.get('[data-cy="input-label-planner-url"]').should(
      "contain.text",
      "Invalid planner URL",
    );

    cy.get('[data-cy="timetable-form-planner-url-input"]')
      .focus()
      .type("random string");

    cy.get('[data-cy="timetable-form"]').submit();
    cy.get('[data-cy="input-label-planner-url"]').should(
      "contain.text",
      "Invalid planner URL",
    );
  });
});

describe("timetable form", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.get('[data-cy="add-timetable"]').click();
    cy.get('[data-cy="timetable-form-name-input"]').type(timetable.name);
    cy.get('[data-cy="timetable-form-planner-url-input"]')
      .focus()
      .type(timetable.plannerURL);
    cy.get('[data-cy="timetable-form"]').submit();
  });

  it("can add", () => {
    cy.window()
      .its("store")
      .its("timetable")
      .invoke("timetablesTree")
      .its(0)
      .its("timetable")
      .its("name")
      .should("eq", timetable.name);

    cy.window()
      .its("store")
      .its("timetable")
      .invoke("timetablesTree")
      .its(0)
      .its("timetable")
      .its("plannerURL")
      .should("eq", timetable.plannerURL);
  });

  it("can edit", () => {
    cy.get('[data-cy="sortable-tree-item"]').click();
    cy.get('[data-cy="timetable-form-name-input"]').clear().type("Edited");
    cy.get('[data-cy="timetable-form"]').submit();

    cy.window()
      .its("store")
      .its("timetable")
      .invoke("timetablesTree")
      .its(0)
      .its("timetable")
      .its("name")
      .should("eq", "Edited");
  });

  it("can delete", () => {
    cy.get('[data-cy="sortable-tree-item"]').click();
    cy.get('[data-cy="delete-alert-trigger"]').click();
    cy.get('[data-cy="delete-alert-delete"]').click();

    cy.window()
      .its("store")
      .its("timetable")
      .invoke("timetablesTree")
      .its("length")
      .should("eq", 0);
  });
});
