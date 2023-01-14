describe("folder form validity", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.get('[data-cy="add-folder"]').click();
  });

  it("shows error on empty name", () => {
    cy.get('[data-cy="folder-form"]').submit();

    cy.get('[data-cy="input-label-name"').should(
      "contain.text",
      "Please enter a name",
    );
  });

  it("shows error on long name", () => {
    cy.get('[data-cy="folder-form-name-input"]').type(
      "12345678901234567890123456789012345678901",
    );
    cy.get('[data-cy="folder-form"]').submit();

    cy.get('[data-cy="input-label-name"').should(
      "contain.text",
      "The name is too long",
    );
  });

  it("can trim name", () => {
    cy.get('[data-cy="folder-form-name-input"]').type(" trim ");
    cy.get('[data-cy="folder-form"]').submit();

    cy.window()
      .its("store")
      .its("timetable")
      .invoke("timetablesTree")
      .its(0)
      .its("name")
      .should("eq", "trim");
  });
});

describe("folder form", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.get('[data-cy="add-folder"]').click();
    cy.get('[data-cy="folder-form-name-input"]').type("test");
    cy.get('[data-cy="folder-form"]').submit();
  });

  it("can add", () => {
    cy.window()
      .its("store")
      .its("timetable")
      .invoke("timetablesTree")
      .its(0)
      .its("name")
      .should("eq", "test");
  });

  it("can edit", () => {
    cy.get('[data-cy="sortable-tree-item"]').click();
    cy.get('[data-cy="folder-form-name-input"]').clear().type("edited");
    cy.get('[data-cy="folder-form"]').submit();

    cy.window()
      .its("store")
      .its("timetable")
      .invoke("timetablesTree")
      .its(0)
      .its("name")
      .should("eq", "edited");
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

export {};
