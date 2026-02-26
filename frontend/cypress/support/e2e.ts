Cypress.Commands.add('register', (name: string, email: string, password: string) => {
  cy.request('POST', 'http://localhost:4000/api/auth/register', {
    name,
    email,
    password,
  }).then((response) => {
    window.localStorage.setItem('token', response.body.token);
  });
});

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.request('POST', 'http://localhost:4000/api/auth/login', {
    email,
    password,
  }).then((response) => {
    window.localStorage.setItem('token', response.body.token);
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      register(name: string, email: string, password: string): Chainable<void>;
      login(email: string, password: string): Chainable<void>;
    }
  }
}

export {};
