declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      dataCy: typeof dataCy;
      store: typeof store;
      actions: typeof actions;
      folderForm: typeof folderForm;
      timetableForm: typeof timetableForm;
    }
  }
}

function dataCy(key: string) {
  return cy.get(`[data-cy='${key}']`);
}

function store(store: string, key: string) {
  return cy.window().its("store").its(store).invoke(key);
}

function actions(store: string, key: string, ...args: unknown[]) {
  cy.window()
    .its("actions")
    .its(store)
    .invoke(key, ...args);
}

function folderForm(name?: string) {
  name && cy.dataCy("input-name").focus().type(name);
  cy.dataCy("folder-form").submit();
}

function timetableForm(name?: string, plannerURL?: string) {
  name && cy.dataCy("input-name").focus().type(name);
  plannerURL &&
    cy.dataCy("input-timetable-planner-url").focus().type(plannerURL);
  cy.dataCy("timetable-form").submit();
}

Cypress.Commands.add("dataCy", dataCy);
Cypress.Commands.add("store", store);
Cypress.Commands.add("actions", actions);
Cypress.Commands.add("folderForm", folderForm);
Cypress.Commands.add("timetableForm", timetableForm);

export {};
