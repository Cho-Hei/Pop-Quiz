// testing admin happy path through UI:
// Registers successfully
// Creates a new game successfully
// (Not required) Updates the thumbnail and name of the game successfully (yes, it will have no questions)
// Starts a game successfully
// Ends a game successfully (yes, no one will have played it)
// Loads the results page successfully
// Logs out of the application successfully
// Logs back into the application successfully

describe('Test happy path', () => {
  it('Test admin happy path', () => {
    // cy.visit('https://example.cypress.io')
    cy.visit('/');

    // check that admin login is visible and click on it
    cy.get('button').contains('Admin Login').should('be.visible');
    cy.get('button').contains('Admin Login').click();

    // go to register page via link
    cy.get('a').contains("Don't have an account? Sign Up").should('be.visible');
    cy.get('a').contains("Don't have an account? Sign Up").click();

    // check all fields and their labels are visible, and enter details
    cy.get('input[id="email"]').should('be.visible');
    cy.get('label[for="email"]').contains('Email Address').should('be.visible');

    cy.get('input[id="name"]').should('be.visible');
    cy.get('label[for="name"]').contains('Name').should('be.visible');

    cy.get('input[id="password"]').should('be.visible');
    cy.get('label[for="password"]').contains('Password').should('be.visible');

    // register
    cy.get('input[id="email"]').type('test@email.com');
    cy.get('input[id="name"]').type('Test User');
    cy.get('input[id="password"]').type('password');

    // check sign up button is visible
    cy.get('button').contains('Sign Up').should('be.visible');
    cy.get('button').contains('Sign Up').click();

    // check that we're on dashboard
    cy.url().should('include', '/dashboard');

    // click create new game
    cy.get('button').contains('Create New Game').should('be.visible');
    cy.get('button').contains('Create New Game').click();

    // check that create game modal and contents is shown
    const createGameModal = cy.get('[role=dialog]');
    createGameModal.should('be.visible');
    createGameModal.within(() => {
      cy.get('h2').contains('Create Game').should('be.visible');
      cy.get('input[id="new-game-title"]').should('be.visible');
      // cy.get('label[for="new-game-title"]').contains('Game Title').should('be.visible');
      cy.get('input[id="new-game-title"]').type('Test game');
      cy.get('button').contains('Create Game').should('be.visible');
      cy.get('button').contains('Create Game').click();
    });

    // check that new game is in dashboard
    cy.wait(1000);
    const gameCard = cy.get('.MuiGrid-container > .MuiGrid-root').first();
    gameCard.should('be.visible');

    // check contents match
    gameCard.within(() => {
      cy.get('h2').contains('Test game').should('be.visible');
      cy.get('h5').contains('0 questions').should('be.visible');
      cy.get('h5').contains('0 secs').should('be.visible');
      cy.get('a').should('have.attr', 'href').and('contain', '/dashboard/editGame');
      cy.get('[aria-label="delete"]').should('be.visible');
      cy.get('button').contains('Start').should('be.visible');
      // start a game
      cy.get('button').contains('Start').click();
    })

    // check start game modal contents
    const startGameModal = cy.get('[role=dialog]');
    startGameModal.should('be.visible');
    startGameModal.within(() => {
      cy.get('h2').contains('Start Game').should('be.visible');
      cy.get('input[id="session-id"]').should('be.visible');
      // cy.get('label[for="new-game-title"]').contains('Game Title').should('be.visible');
      // cy.get('input[id="new-game-title"]').type('Test game');
      cy.get('button').contains('Stop Game').should('be.visible');
      cy.get('button').contains('Start Playing').should('be.visible');
      cy.get('button').contains('Start Playing').click();
    });

    // check that we're on results
    cy.url().should('include', '/results/');

    // check that results are shown
    cy.wait(1000);
    cy.get('h1').contains('Result').should('be.visible');

    // logout
    cy.get('button').contains('Logout').should('be.visible');
    cy.get('button').contains('Logout').click();

    // go to login
    cy.wait(1000);
    cy.get('button').contains('Admin Login').should('be.visible');
    cy.get('button').contains('Admin Login').click();

    // check all fields and their labels are visible, and enter details
    cy.get('input[id="email"]').should('be.visible');
    cy.get('label[for="email"]').contains('Email Address').should('be.visible');

    cy.get('input[id="password"]').should('be.visible');
    cy.get('label[for="password"]').contains('Password').should('be.visible');

    // login
    cy.get('input[id="email"]').type('test@email.com');
    cy.get('input[id="password"]').type('password');

    // check sign in button is visible
    cy.get('button').contains('Sign In').should('be.visible');
    cy.get('button').contains('Sign In').click();

    // check that we're on dashboard
    cy.url().should('include', '/dashboard');
  })
})
