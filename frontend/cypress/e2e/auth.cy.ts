describe('Authentication', () => {
  const testUser = {
    name: 'Test User',
    email: `test-${Date.now()}@example.com`,
    password: '123456',
  };

  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('should redirect unauthenticated users to login', () => {
    cy.visit('/crypto');
    cy.url().should('include', '/login');
  });

  it('should register a new user', () => {
    cy.visit('/register');

    cy.get('input[type="text"]').type(testUser.name);
    cy.get('input[type="email"]').type(testUser.email);
    cy.get('input[type="password"]').type(testUser.password);
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/crypto');
    cy.window().its('localStorage.token').should('exist');
  });

  it('should login with valid credentials', () => {
    cy.register(testUser.name, testUser.email, testUser.password);
    cy.clearLocalStorage();

    cy.visit('/login');

    cy.get('input[type="email"]').type(testUser.email);
    cy.get('input[type="password"]').type(testUser.password);
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/crypto');
    cy.window().its('localStorage.token').should('exist');
  });

  it('should show error for invalid credentials', () => {
    cy.visit('/login');

    cy.get('input[type="email"]').type('wrong@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.get('.error-message').should('be.visible');
  });

  it('should logout and redirect to login', () => {
    cy.register(testUser.name, `logout-${Date.now()}@example.com`, testUser.password);
    cy.visit('/crypto');

    cy.contains('Logout').click();

    cy.url().should('include', '/login');
    cy.window().its('localStorage.token').should('not.exist');
  });
});
