import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import Loader from '../components/Loader';

export default function QuizPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [seconds, setSeconds] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const submittedRef = useRef(false);

  useEffect(() => {
    Promise.all([
      api.get(`/quizzes/${id}`),
      api.get(`/questions/quiz/${id}`),
    ]).then(([qz, qs]) => {
      setQuiz(qz.data);
      setQuestions(qs.data);
      setSeconds(qz.data.timer_minutes * 60);
    });
  }, [id]);

  useEffect(() => {
    if (!seconds || submittedRef.current) return;
    const t = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) { clearInterval(t); submit(true); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds && !submittedRef.current]);

  const submit = async (auto = false) => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    const payload = {
      quiz_id: Number(id),
      answers: questions.map(q => ({
        question_id: q.question_id,
        selected_option: answers[q.question_id] || null,
      })),
    };
    try {
      const { data } = await api.post('/results/submit', payload);
      nav(`/result/${data.attempt_id}`, { state: { auto } });
    } catch (e) {
      alert(e.response?.data?.message || 'Submit failed');
      setSubmitting(false); submittedRef.current = false;
    }
  };

  if (!quiz) return <Loader />;
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <section>
      <div className="quiz-header">
        <h2>{quiz.title}</h2>
        <div className={`timer ${seconds < 30 ? 'danger' : ''}`}>⏱ {mm}:{ss}</div>
      </div>
      {questions.map((q, i) => (
        <div className="card" key={q.question_id}>
          <h4>Q{i + 1}. {q.question_text}</h4>
          {['A','B','C','D'].map(opt => (
            <label key={opt} className="option">
              <input
                type="radio"
                name={`q-${q.question_id}`}
                checked={answers[q.question_id] === opt}
                onChange={() => setAnswers({ ...answers, [q.question_id]: opt })}
              />
              <span><b>{opt}.</b> {q[`option_${opt.toLowerCase()}`]}</span>
            </label>
          ))}
        </div>
      ))}
      <button className="btn" disabled={submitting} onClick={() => submit(false)}>
        {submitting ? 'Submitting…' : 'Submit Quiz'}
      </button>
    </section>
  );
}
