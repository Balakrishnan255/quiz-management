import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import api from '../api/client';
import Loader from '../components/Loader';

export default function ResultPage() {
  const { attemptId } = useParams();
  const location = useLocation();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/results/attempt/${attemptId}`).then(r => setData(r.data));
  }, [attemptId]);

  if (!data) return <Loader />;
  const { attempt, answers } = data;
  const pct = Math.round((attempt.score / attempt.total_questions) * 100);

  return (
    <section>
      <div className="card score-card">
        <h2>Your Score</h2>
        {location.state?.auto && <p className="muted">⏰ Time's up — auto submitted.</p>}
        <div className="score">{attempt.score} / {attempt.total_questions}</div>
        <div className="muted">{pct}%</div>
      </div>
      <h3>Review</h3>
      {answers.map((a, i) => (
        <div key={a.answer_id} className={`card review ${a.is_correct ? 'ok' : 'bad'}`}>
          <h4>Q{i + 1}. {a.question_text}</h4>
          {['A','B','C','D'].map(opt => {
            const isCorrect = a.correct_option === opt;
            const isPicked = a.selected_option === opt;
            return (
              <div key={opt} className={`opt ${isCorrect ? 'correct' : ''} ${isPicked && !isCorrect ? 'wrong' : ''}`}>
                <b>{opt}.</b> {a[`option_${opt.toLowerCase()}`]}
                {isCorrect && ' ✅'} {isPicked && !isCorrect && ' ❌'}
              </div>
            );
          })}
        </div>
      ))}
      <Link className="btn" to="/dashboard">Back to Quizzes</Link>
    </section>
  );
}
