/*
 For a given data structure of a question, produce another
 object that doesn't contain any important meta data (e.g. the answer)
 to return to a "player"
*/
export const quizQuestionPublicReturn = question => {
  const quizwithoutanswers = JSON.parse(JSON.stringify(question));
  quizwithoutanswers.answers.map((a) => delete a.answerCorrect);
  return quizwithoutanswers;
};

/*
 For a given data structure of a question, get the IDs of
 the correct answers (minimum 1).
*/
export const quizQuestionGetCorrectAnswers = question => {
  let answers = JSON.parse(JSON.stringify(question)).answers;
  answers = answers.filter((a) => a.answerCorrect == true);
  const answerIds = [];
  answers.map((a) => answerIds.push(a.answerId));
  return answerIds;
};

/*
 For a given data structure of a question, get the IDs of
 all of the answers, correct or incorrect.
*/
export const quizQuestionGetAnswers = question => {
  let answers = JSON.parse(JSON.stringify(question)).answers;
  const answerIds = [];
  answers.map((a) => answerIds.push(a.answerId));
  return answerIds;
};

/*
 For a given data structure of a question, get the duration
 of the question once it starts. (Seconds)
*/
export const quizQuestionGetDuration = question => {
  const timeLimit = JSON.parse(JSON.stringify(question)).timeLimit;
  return timeLimit;
};
