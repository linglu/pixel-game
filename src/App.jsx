import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

const STATUS = {
  LOBBY: 'LOBBY',
  LOADING: 'LOADING',
  PLAYING: 'PLAYING',
  RESULT: 'RESULT',
};

const GAS_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;
const PASS_THRESHOLD = parseInt(import.meta.env.VITE_PASS_THRESHOLD) || 3;
const QUESTION_COUNT = parseInt(import.meta.env.VITE_QUESTION_COUNT) || 5;

// Preload 100 Boss Images using DiceBear Pixel Art
const BOSS_IMAGES = Array.from({ length: 100 }, (_, i) => 
  `https://api.dicebear.com/7.x/pixel-art/svg?seed=${i}&backgroundColor=b6e3f4,c0aede,d1d4f9`
);

export default function App() {
  const [status, setStatus] = useState(STATUS.LOBBY);
  const [userId, setUserId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loadingMsg, setLoadingMsg] = useState('INSERT COIN...');
  const [bossSeed, setBossSeed] = useState(0);

  const startNewGame = async () => {
    if (!userId.trim()) return alert('PLEASE ENTER ID!');
    
    setStatus(STATUS.LOADING);
    setLoadingMsg('FETCHING QUESTS...');
    
    try {
      const response = await fetch(`${GAS_URL}?action=getQuestions&count=${QUESTION_COUNT}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      
      if (data.questions) {
        setQuestions(data.questions);
        setCurrentIndex(0);
        setAnswers([]);
        setBossSeed(Math.floor(Math.random() * 100));
        setStatus(STATUS.PLAYING);
      } else {
        throw new Error('DATA_FORMAT_ERROR');
      }
    } catch (err) {
      console.error('FETCH_ERROR:', err);
      alert(`連線失敗！\n原因: ${err.message}\n\n請確認：\n1. GAS 已部署為「所有人」存取\n2. 試算表中有「題目」工作表\n3. 網路連線正常`);
      setStatus(STATUS.LOBBY);
    }
  };

  const handleAnswer = (choice) => {
    const currentQuestion = questions[currentIndex];
    const isCorrect = choice === currentQuestion.answer;
    
    const newAnswers = [...answers, { ...currentQuestion, userChoice: choice, isCorrect }];
    setAnswers(newAnswers);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setBossSeed(Math.floor(Math.random() * 100));
    } else {
      submitResults(newAnswers);
    }
  };

  const submitResults = async (finalAnswers) => {
    setStatus(STATUS.LOADING);
    setLoadingMsg('CALCULATING SCORE...');

    const correctCount = finalAnswers.filter(a => a.isCorrect).length;
    const score = Math.round((correctCount / QUESTION_COUNT) * 100);

    const results = {
      score,
      correctCount,
      total: QUESTION_COUNT,
      passThreshold: PASS_THRESHOLD
    };

    try {
      await fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors', // GAS often needs no-cors for POST if not handling options properly
        body: JSON.stringify({ userId, results })
      });
      
      // Since no-cors won't give us a readable response, we assume success or handle separately
      setStatus(STATUS.RESULT);
      if (correctCount >= PASS_THRESHOLD) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ff00ff', '#00ffff', '#ffff00']
        });
      }
    } catch (err) {
      console.error(err);
      setStatus(STATUS.RESULT);
    }
  };

  if (status === STATUS.LOADING) {
    return (
      <div className="arcade-panel text-center">
        <h2 className="blink">{loadingMsg}</h2>
      </div>
    );
  }

  if (status === STATUS.LOBBY) {
    return (
      <div className="arcade-panel text-center">
        <h1 className="glitch-text" style={{ fontSize: '24px', marginBottom: '30px' }}>PIXEL QUIZ ARCADE</h1>
        <div style={{ marginBottom: '40px' }}>
          <p style={{ fontSize: '12px', color: '#888' }}>ENTER PLAYER ID</p>
          <input 
            className="pixel-input" 
            placeholder="PLAYER 1" 
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>
        <button className="pixel-btn primary" onClick={startNewGame}>
          START GAME
        </button>
      </div>
    );
  }

  if (status === STATUS.PLAYING) {
    const q = questions[currentIndex];
    return (
      <div className="arcade-panel">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${((currentIndex + 1) / QUESTION_COUNT) * 100}%` }} />
        </div>
        
        <div className="boss-container">
          <img src={BOSS_IMAGES[bossSeed]} alt="Boss" className="boss-img" />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <p style={{ fontSize: '10px', color: 'var(--secondary)' }}>STAGE {currentIndex + 1}</p>
          <h3 style={{ lineHeight: '1.5', fontSize: '16px' }}>{q.question}</h3>
        </div>

        <div className="option-grid">
          {Object.entries(q.options).map(([key, val]) => (
            <button 
              key={key} 
              className="pixel-btn secondary" 
              onClick={() => handleAnswer(key)}
            >
              {key}: {val}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (status === STATUS.RESULT) {
    const correctCount = answers.filter(a => a.isCorrect).length;
    const isPassed = correctCount >= PASS_THRESHOLD;

    return (
      <div className="arcade-panel text-center">
        <h2 className="glitch-text" style={{ color: isPassed ? '#0f0' : '#f00' }}>
          {isPassed ? 'LEVEL CLEAR!' : 'GAME OVER'}
        </h2>
        
        <div style={{ margin: '30px 0', fontSize: '20px' }}>
          <p>SCORE: {Math.round((correctCount / QUESTION_COUNT) * 100)}</p>
          <p style={{ fontSize: '12px' }}>{correctCount} / {QUESTION_COUNT} CORRECT</p>
        </div>

        <button className="pixel-btn primary" onClick={() => setStatus(STATUS.LOBBY)}>
          RETRY?
        </button>
      </div>
    );
  }

  return null;
}
