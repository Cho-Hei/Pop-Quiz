import React from 'react';
import GameCard from './GameCard';
import { ThemeProvider } from '@mui/system';
import theme from './Theme.jsx';
import { BrowserRouter } from 'react-router-dom';

const defaultImg =
  'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png';

describe('GameCard tests', () => {
  it('Render card without props', () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <GameCard />
        </BrowserRouter>
      </ThemeProvider>
    );

    cy.wait(5000);
    cy.get('[role="img"]').should(
      'have.attr',
      'style',
      `background-image: url("${defaultImg}");`
    );
    const cardText = cy.get('.MuiCardContent-root');
    cardText.within(() => {
      cy.get('h2').should('contain', '');
      cy.contains('No questions');
      cy.contains('0 secs');
    });
    cy.get('a').should('have.attr', 'href', '/editGame/undefined');
    cy.get('button[aria-label="delete"]').should('be.visible');
    cy.get('button').contains('History').should('be.visible');
    cy.get('button').contains('Start').should('be.visible');
  });

  it('Render card with gameID', () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <GameCard gameId={12345} />
        </BrowserRouter>
      </ThemeProvider>
    );

    cy.wait(5000);
    cy.get('[role="img"]').should(
      'have.attr',
      'style',
      `background-image: url("${defaultImg}");`
    );
    const cardText = cy.get('.MuiCardContent-root');
    cardText.within(() => {
      cy.get('h2').should('contain', '');
      cy.contains('No questions');
      cy.contains('0 secs');
    });
    cy.get('a').should('have.attr', 'href', '/editGame/12345');
    cy.get('button[aria-label="delete"]').should('be.visible');
    cy.get('button').contains('History').should('be.visible');
    cy.get('button').contains('Start').should('be.visible');
  });

  it('Render card with gameName', () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <GameCard gameName={'My test game'} />
        </BrowserRouter>
      </ThemeProvider>
    );

    cy.wait(5000);
    cy.get('[role="img"]').should(
      'have.attr',
      'style',
      `background-image: url("${defaultImg}");`
    );
    const cardText = cy.get('.MuiCardContent-root');
    cardText.within(() => {
      cy.get('h2').should('contain', '');
      cy.contains('No questions');
      cy.contains('0 secs');
    });
    cy.get('a').should('have.attr', 'href', '/editGame/undefined');
    cy.get('button[aria-label="delete"]').should('be.visible');
    cy.get('button').contains('History').should('be.visible');
    cy.get('button').contains('Start').should('be.visible');
  });

  it('Render card with gameThumbnail', () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <GameCard
            gameThumbnail={
              'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
            }
          />
        </BrowserRouter>
      </ThemeProvider>
    );
    cy.get('[role="img"]').should(
      'have.attr',
      'style',
      'background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==");'
    );
    const cardText = cy.get('.MuiCardContent-root');
    cardText.within(() => {
      cy.get('h2').should('contain', '');
      cy.contains('No questions');
      cy.contains('0 secs');
    });
    cy.get('a').should('have.attr', 'href', '/editGame/undefined');
    cy.get('button[aria-label="delete"]').should('be.visible');
    cy.get('button').contains('History').should('be.visible');
    cy.get('button').contains('Start').should('be.visible');
  });

  const startGameModal = () => {};

  it('Render card with sessionActive', () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <GameCard sessionActive={12345} startGameModal={startGameModal} />
        </BrowserRouter>
      </ThemeProvider>
    );

    cy.wait(5000);
    cy.get('[role="img"]').should(
      'have.attr',
      'style',
      `background-image: url("${defaultImg}");`
    );
    const cardText = cy.get('.MuiCardContent-root');
    cardText.within(() => {
      cy.get('h2').should('contain', '');
      cy.contains('No questions');
      cy.contains('0 secs');
    });
    cy.get('a').should('have.attr', 'href', '/editGame/undefined');
    cy.get('button[aria-label="delete"]').should('be.visible');
    cy.get('button').contains('History').should('be.visible');
    cy.get('button').contains('Start').click();
    cy.get('button').contains('Stop').should('be.visible');
  });
});
