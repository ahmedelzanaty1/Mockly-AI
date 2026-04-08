export const saveSession = (messages) => {
  const session = {
    id: Date.now(),
    date: new Date().toLocaleString(),
    transcript: messages
  };
  const history = JSON.parse(localStorage.getItem('interview_history') || '[]');
  history.unshift(session);
  localStorage.setItem('interview_history', JSON.stringify(history));
};