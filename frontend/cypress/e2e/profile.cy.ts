describe('User Profile', () => {
  const testUser = {
    name: 'Profile User',
    email: `profile-${Date.now()}@example.com`,
    password: '123456',
  };

  beforeEach(() => {
    cy.register(testUser.name, testUser.email, testUser.password);
    cy.visit('/profile');
  });

  it('should display user profile information', () => {
    cy.get('.profile-card').should('exist');
    cy.contains(testUser.name).should('be.visible');
    cy.contains(testUser.email).should('be.visible');
  });

  it('should show avatar placeholder when no image', () => {
    cy.get('.avatar-placeholder').should('exist');
    cy.get('.avatar-placeholder').should('contain.text', 'P');
  });

  it('should switch to edit mode when clicking Edit Profile', () => {
    cy.contains('Edit Profile').click();

    cy.get('.edit-card').should('exist');
    cy.get('input#name').should('have.value', testUser.name);
    cy.get('input#email').should('have.value', testUser.email);
  });

  it('should update user name', () => {
    cy.contains('Edit Profile').click();

    cy.get('input#name').clear().type('Updated Name');
    cy.contains('Save').click();

    cy.get('.profile-card').should('exist');
    cy.contains('Updated Name').should('be.visible');
  });

  it('should update user description', () => {
    cy.contains('Edit Profile').click();

    cy.get('textarea#description').type('Full stack developer with crypto experience.');
    cy.contains('Save').click();

    cy.contains('Full stack developer with crypto experience.').should('be.visible');
  });

  it('should cancel edit and return to view mode', () => {
    cy.contains('Edit Profile').click();
    cy.contains('Cancel').click();

    cy.get('.profile-card').should('exist');
    cy.get('.edit-card').should('not.exist');
  });
});
