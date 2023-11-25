import React from 'react'
import EditGameQuestion from './EditGameQuestion'
import { ThemeProvider } from '@mui/system';
import theme from './Theme.jsx';
import { BrowserRouter } from 'react-router-dom'

describe('EditGameQuestion tests', () => {
  it('Render editGameQuestion without props', () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <EditGameQuestion />
        </BrowserRouter>
      </ThemeProvider>
    );

    cy.get('p').should('contain', '').and('not.be.visible');
    cy.get('svg[data-testid="EditIcon"]').should('be.visible');
    cy.get('svg[data-testid="DeleteIcon"]').should('be.visible');
  });

  it('Render editGameQuestion with question text', () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <EditGameQuestion
            question='Test question'
          />
        </BrowserRouter>
      </ThemeProvider>
    );

    cy.get('p').should('contain', 'Test question').and('be.visible');
    cy.get('svg[data-testid="EditIcon"]').should('be.visible');
    cy.get('svg[data-testid="DeleteIcon"]').should('be.visible');
  });
})
