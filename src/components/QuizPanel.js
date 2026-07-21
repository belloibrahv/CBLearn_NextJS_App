'use client';
import { useState } from 'react';

export default function QuizPanel({ quiz }) {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const allAnswered = quiz.questions.every((q) => answers[q.id] !== undefined);

  function selectOption(questionId, optionIndex) {
    if (result) return; // lock after submission
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`/api/quiz/${quiz.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not submit quiz.');
        setSubmitting(false);
        return;
      }
      setResult(data);
    } catch (e) {
      setError('Something went wrong submitting your quiz.');
    }
    setSubmitting(false);
  }

  function retake() {
    setAnswers({});
    setResult(null);
  }

  const feedbackMap = {};
  if (result) result.feedback.forEach((f) => { feedbackMap[f.questionId] = f; });

  return (
    <div>
      {result && (
        <div className={`md-chip ${result.passed ? 'md-chip-success' : 'md-chip-error'}`} style={{ marginBottom: 16, padding: '10px 16px', fontSize: 13.5 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{result.passed ? 'check_circle' : 'info'}</span>
          You scored {result.correctCount} out of {result.totalCount} ({result.score}%)
          {result.passed ? ' — well done!' : ' — review the topic and try again.'}
        </div>
      )}

      {quiz.questions.map((q, idx) => {
        const fb = feedbackMap[q.id];
        return (
          <div key={q.id} className="md-card" style={{ marginBottom: 14 }}>
            <div className="md-label">QUESTION {idx + 1} OF {quiz.questions.length}</div>
            <div className="md-title" style={{ margin: '6px 0 12px' }}>{q.questionText}</div>
            {q.options.map((opt, oi) => {
              let style = { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', border: '1.5px solid var(--md-sys-color-outline-variant)', borderRadius: 8, marginBottom: 8, fontSize: 14, cursor: result ? 'default' : 'pointer' };
              if (!result && answers[q.id] === oi) {
                style.borderColor = 'var(--md-sys-color-primary)';
                style.background = 'var(--md-sys-color-primary-container)';
              }
              if (result && fb) {
                if (oi === fb.correctOption) {
                  style.borderColor = 'var(--md-sys-color-success)';
                  style.background = 'var(--md-sys-color-success-container)';
                } else if (oi === fb.selected && !fb.isCorrect) {
                  style.borderColor = 'var(--md-sys-color-error)';
                  style.background = 'var(--md-sys-color-error-container)';
                }
              }
              return (
                <div key={oi} style={style} onClick={() => selectOption(q.id, oi)}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    {result
                      ? (oi === fb.correctOption ? 'check_circle' : (oi === fb.selected ? 'cancel' : 'radio_button_unchecked'))
                      : (answers[q.id] === oi ? 'radio_button_checked' : 'radio_button_unchecked')}
                  </span>
                  {opt}
                </div>
              );
            })}
          </div>
        );
      })}

      {error && <div className="md-chip md-chip-error" style={{ marginBottom: 14 }}>{error}</div>}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="md-body-sm">
          {result ? 'Quiz submitted.' : `${Object.keys(answers).length} of ${quiz.questions.length} answered`}
        </span>
        {!result ? (
          <button className="md-btn md-btn-filled" disabled={!allAnswered || submitting} onClick={handleSubmit}>
            {submitting ? 'Submitting…' : 'Submit Quiz'}
          </button>
        ) : (
          <button className="md-btn md-btn-outlined" onClick={retake}>Retake Quiz</button>
        )}
      </div>
    </div>
  );
}
