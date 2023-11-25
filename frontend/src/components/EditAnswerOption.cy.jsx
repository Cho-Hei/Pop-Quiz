import React from 'react';
import { ThemeProvider } from '@mui/system';
import theme from './Theme.jsx';
import { BrowserRouter } from 'react-router-dom';
import EditAnswerOption from './EditAnswerOption.jsx';

describe('Answer Option for question', () => {
  const handleAnswerChange = (ans) => {

  }

  it('shows the detail of an answer (Correct Answer)', () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <EditAnswerOption handleAnswerChange={handleAnswerChange} answerCorrect={true} answerText='This is the answer'/>
        </BrowserRouter>
      </ThemeProvider>
    );
    cy.get('input[type=checkbox]').should('exist');
    cy.get('input[type=checkbox]').should('be.checked')
    cy.get('input[type=text]').should('exist');
    cy.get('input[type=text]').should('have.value', 'This is the answer');
    cy.get('button[aria-label=delete]').should('exist');
  });

  it('shows the detail of an answer (Incorrect Answer)', () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <EditAnswerOption handleAnswerChange={handleAnswerChange} answerCorrect={false} answerText='This is not the answer'/>
        </BrowserRouter>
      </ThemeProvider>
    );
    cy.get('input[type=checkbox]').should('exist');
    cy.get('input[type=checkbox]').should('not.be.checked')
    cy.get('input[type=text]').should('exist');
    cy.get('input[type=text]').should('have.value', 'This is not the answer');
    cy.get('button[aria-label=delete]').should('exist');
  });
});
