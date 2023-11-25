import Config from '../../src/config.json';

describe('Test for Player perspective', () => {
  it('Create test by admin then join as player', () => {
    cy.visit('/');

    // Sign up as a admin
    cy.get('button').contains('Admin Login').click();
    cy.get('a').contains("Don't have an account? Sign Up").click();

    cy.get('input[id="email"]').type('test2@email.com');
    cy.get('input[id="name"]').type('Test User2');
    cy.get('input[id="password"]').type('password');
    cy.get('button').contains('Sign Up').click();

    cy.url().should('include', '/dashboard');

    // Create a new game
    cy.get('button').contains('Create New Game').click();

    const createGameModal = cy.get('[role=dialog]');
    createGameModal.within(() => {
      cy.get('input[id="new-game-title"]').type('Test game');
      cy.get('button').contains('Create Game').should('be.visible');
      cy.get('button').contains('Create Game').click();
    });

    // check that new game is in dashboard
    cy.wait(1000);
    const gameCard = cy.get('.MuiGrid-container > .MuiGrid-root').first();
    gameCard.should('be.visible');

    // Edit the game
    gameCard.within(() => {
      cy.get('svg[data-testid="EditIcon"]').click();
    });

    cy.wait(1000);
    cy.url().should('include', '/editGame/');

    // Added a question
    let quizId;
    cy.url().then((val) => {
      cy.log(val.split('/'));
      quizId = val.split('/')[5];
      cy.log(quizId);

      cy.get('button').contains('ADD Question', { matchCase: false }).click();
      const questionCard = cy.get('.MuiGrid-container > .MuiGrid-root').first();
      questionCard.should('be.visible');

      questionCard.within(() => {
        cy.get('svg[data-testid="EditIcon"]').click();
      });

      const modal = cy.get('[role=dialog]');
      modal.should('be.visible');
      modal.within(() => {
        cy.get('input[id="question-time-limit"]').type('{backspace}30');
        cy.get('input[id="question-points"]').type('{backspace}2');

        cy.get('button').contains('Save Changes', { matchCase: false }).click();
      });
      cy.get('button').contains('Save Changes', { matchCase: false }).click();

      // Admin Logout
      cy.contains('Logout', { matchCase: false }).click();

      let token;
      let sessionid;

      // API call to start a game (duel screen not supported for cypress)
      cy.request({
        method: 'POST',
        url: `http://localhost:${Config.BACKEND_PORT}/admin/auth/login`,
        form: true,
        headers: {
          'Content-type': 'application/json',
        },
        body: {
          email: 'test2@email.com',
          password: 'password',
        },
      }).then((response) => {
        cy.log(response);
        token = response.body.token;
        cy.log(token);

        cy.request({
          method: 'POST',
          url: `http://localhost:${Config.BACKEND_PORT}/admin/quiz/${quizId}/start`,
          form: true,
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        cy.request({
          method: 'GET',
          url: `http://localhost:${Config.BACKEND_PORT}/admin/quiz/${quizId}`,
          form: true,
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }).then((response) => {
          cy.log(response);
          sessionid = response.body.active;
          cy.log(sessionid);

           // Join as a player
          cy.visit('/');
          cy.get('button')
            .contains('Join a Game', { matchCase: false })
            .click();

         
          cy.get('input[name=session-id]').type(sessionid);
          cy.get('button[name=join-session]').click();

          cy.get('input[name=name]').type('Player Tester');
          cy.get('button[name=play-start]').click();
          cy.contains('Waiting to start');

          // Admin API call to advance to the first question
          cy.request({
            method: 'POST',
            url: `http://localhost:${Config.BACKEND_PORT}/admin/quiz/${quizId}/advance`,
            form: true,
            headers: {
              'Content-type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }).then(() => {

            // Player answer the question
            cy.get('[type=checkbox]').first().click();
            cy.wait(1000);
            cy.get('[type=checkbox]').should('exist');

            // Admin API call to finish the question and to the result page
            cy.request({
              method: 'POST',
              url: `http://localhost:${Config.BACKEND_PORT}/admin/quiz/${quizId}/advance`,
              form: true,
              headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }).then(() => {
              
              // Player view their result
              cy.wait(4000);
              cy.contains('Your Result');
            });
          });
        });
      });
    });
  });
});
