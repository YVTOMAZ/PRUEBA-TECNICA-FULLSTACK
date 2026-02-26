describe('Cryptocurrency List', () => {
  beforeEach(() => {
    cy.register('Crypto User', `crypto-${Date.now()}@example.com`, '123456');
    cy.visit('/crypto');
  });

  it('should display at least 5 cryptocurrency cards', () => {
    cy.get('.crypto-card').should('have.length.at.least', 5);
  });

  it('should display coin name, symbol, and price on each card', () => {
    cy.get('.crypto-card').first().within(() => {
      cy.get('.coin-name').should('exist');
      cy.get('.coin-symbol').should('exist');
      cy.get('.price').should('exist');
    });
  });

  it('should open detail modal when clicking a card', () => {
    cy.get('.crypto-card').first().click();

    cy.get('.modal-overlay').should('be.visible');
    cy.get('.detail-header').should('exist');
    cy.get('.stats-grid').should('exist');
  });

  it('should close modal when clicking close button', () => {
    cy.get('.crypto-card').first().click();
    cy.get('.modal-overlay').should('be.visible');

    cy.get('.modal-close').click();
    cy.get('.modal-overlay').should('not.exist');
  });

  it('should filter cryptocurrencies by search term', () => {
    cy.get('.search-bar input').type('Bitcoin');
    // Wait for debounce
    cy.wait(500);

    cy.get('.crypto-card').should('have.length.at.least', 1);
    cy.get('.crypto-card').first().should('contain.text', 'Bitcoin');
  });

  it('should show pagination controls', () => {
    cy.get('.pagination').should('exist');
    cy.get('.page-info').should('contain.text', 'Page 1');
  });

  it('should navigate to next page', () => {
    cy.get('.pagination').contains('Next').click();
    cy.get('.page-info').should('contain.text', 'Page 2');
  });
});
