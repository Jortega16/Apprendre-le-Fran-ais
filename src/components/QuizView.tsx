/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, RefreshCw, AlertCircle, CheckCircle2, XCircle, 
  HelpCircle, ArrowRight, BookOpen, Sparkles, Star, Award, Heart
} from 'lucide-react';
import { QuizQuestion, quizDatabase, lessonsData, vocabulairesEssentiels } from '../data';
import AudioButton from './AudioButton';

interface QuizViewProps {
  completedLessons: number[];
  onToggleCompleteLesson: (id: number) => void;
  onUpdateHighScore: (score: number, total: number) => void;
}

export default function QuizView({
  completedLessons,
  onToggleCompleteLesson,
  onUpdateHighScore
}: QuizViewProps) {
  // Quiz parameters
  const [quizSize, setQuizSize] = useState<5 | 10 | 17>(10);
  const [filterByLesson, setFilterByLesson] = useState<number | 'all'>('all');
  
  // Game states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [quizHistory, setQuizHistory] = useState<{ date: string; score: number; total: number }[]>([]);
  const [streakCount, setStreakCount] = useState(0); // Tracks current consecutive correct answers
  
  // Matching game states (used for match questions)
  const [selectedFrench, setSelectedFrench] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [matchingError, setMatchingError] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('french_a1_quiz_history');
      if (storedHistory) {
        setQuizHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Error reading quiz history", e);
    }
  }, []);

  // Save history helper function
  const saveQuizAttempt = (finalScore: number, finalTotal: number) => {
    const newAttempt = {
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      score: finalScore,
      total: finalTotal
    };
    const updated = [newAttempt, ...quizHistory].slice(0, 5); // keep 5 recent
    setQuizHistory(updated);
    try {
      localStorage.setItem('french_a1_quiz_history', JSON.stringify(updated));
    } catch (e) {
      console.error("Error saving history to localStorage", e);
    }
    // Update top level highscore
    onUpdateHighScore(finalScore, finalTotal);
  };

  // Build/Start quiz questions
  const startQuiz = () => {
    let pool = [...quizDatabase];
    
    // Filter pool if specific lesson selected
    if (filterByLesson !== 'all') {
      pool = pool.filter(q => q.lessonId === filterByLesson);
    }

    // Shuffle pool
    const shuffled = pool.sort(() => 0.5 - Math.random());
    
    // Slice according to quiz size, handling cases where pool is smaller
    const selectedQuestions = shuffled.slice(0, Math.min(quizSize, shuffled.length));
    
    setQuestions(selectedQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsAnswered(false);
    setSelectedOption(null);
    setTypedAnswer('');
    setMatchedPairs({});
    setSelectedFrench(null);
    setIsPlaying(true);
    setStreakCount(0);
  };

  const currentQuestion = useMemo(() => {
    return questions[currentQuestionIndex];
  }, [questions, currentQuestionIndex]);

  // Handle single match selection
  const handleFrenchClick = (french: string) => {
    if (isAnswered) return;
    setSelectedFrench(french);
    setMatchingError(false);
  };

  const handleSpanishClick = (spanish: string) => {
    if (isAnswered || !selectedFrench) return;
    
    const correctPairs = currentQuestion.correctAnswer as Record<string, string>;
    if (correctPairs[selectedFrench] === spanish) {
      // Correct pair found
      const updatedPairs = { ...matchedPairs, [selectedFrench]: spanish };
      setMatchedPairs(updatedPairs);
      setSelectedFrench(null);
      
      // If we matched all pairs
      if (Object.keys(updatedPairs).length === currentQuestion.pairMatches?.length) {
        setIsAnswered(true);
        setScore(prev => prev + 1);
        setStreakCount(prev => prev + 1);
      }
    } else {
      // Incorrect match
      setMatchingError(true);
      setSelectedFrench(null);
      setTimeout(() => setMatchingError(false), 1500);
    }
  };

  // Submit Answer (Multiple Choice & Fills)
  const handleSubmitAnswer = (chosenValue?: string) => {
    if (isAnswered) return;
    
    let answerToCompare = chosenValue || selectedOption || typedAnswer.trim();
    if (currentQuestion.type === 'fill-blank' || currentQuestion.type === 'conjugation') {
      answerToCompare = answerToCompare.toLowerCase();
    }

    const correctAns = currentQuestion.correctAnswer as string;
    const isCorrect = answerToCompare.toLowerCase() === correctAns.toLowerCase();

    if (isCorrect) {
      setScore(prev => prev + 1);
      setStreakCount(prev => prev + 1);
    } else {
      setStreakCount(0);
    }

    setIsAnswered(true);
    if (!chosenValue && selectedOption) {
      setSelectedOption(selectedOption); // hold state
    }
  };

  const handleNextQuestion = () => {
    const nextIdx = currentQuestionIndex + 1;
    if (nextIdx >= questions.length) {
      // Quiz completed!
      saveQuizAttempt(score, questions.length);
      setIsPlaying(false);
    } else {
      setCurrentQuestionIndex(nextIdx);
      setIsAnswered(false);
      setSelectedOption(null);
      setTypedAnswer('');
      setMatchedPairs({});
      setSelectedFrench(null);
    }
  };

  // Quick helper to fetch the topic name from ID
  const getTopicName = (id: number) => {
    const theme = lessonsData.find(l => l.id === id);
    return theme ? `${theme.number}. ${theme.title}` : `Tema ${id}`;
  };

  // Score description helper
  const scoreBadgeDetails = useMemo(() => {
    if (questions.length === 0) return { title: 'Examen', desc: '', color: 'bg-slate-100' };
    const ratio = score / questions.length;
    if (ratio === 1) {
      return { title: '¡Éxito Absoluto! 🌟', desc: '¡Felicidades! Has respondido a todos los temas de primer nivel de forma correcta. ¡Eres un experto en el nivel A1!', color: 'bg-emerald-50 text-emerald-800 border-emerald-250' };
    } else if (ratio >= 0.75) {
      return { title: '¡Excelente Trabajo! Bon travail ! 🎉', desc: 'Tienes bases francesas sólidas de Unit 1 listos para ser puestos a prueba en tu curso.', color: 'bg-indigo-50 text-indigo-800 border-indigo-250' };
    } else if (ratio >= 0.5) {
      return { title: 'Buen intento · Pas mal!', desc: 'Casi lo logras. Te recomendamos repasar los temas de artículos indefinidos, verbos o adjetivos.', color: 'bg-amber-50 text-amber-800 border-amber-250' };
    } else {
      return { title: 'Sigue practicando · Continuez ! 💪', desc: 'Dominar un idioma requiere regularidad. Te recomendamos usar la pestaña "Estudio" y probar otra vez.', color: 'bg-rose-50 text-rose-800 border-rose-250' };
    }
  }, [score, questions]);

  return (
    <div id="quiz-view-container" className="max-w-4xl mx-auto space-y-6">
      
      {/* Dynamic View Toggles (Setting screen OR Active Playing) */}
      {!isPlaying ? (
        
        <div id="quiz-dashboard-parent" className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Main Setting Launcher panel */}
          <div id="quiz-setup-panel" className="md:col-span-8 bg-white border border-slate-150 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Prácticas y Evaluaciones</h2>
                <p className="text-xs text-slate-500">Mide tu dominio de la Unidad 1 en Francés A1 de manera activa</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-extrabold text-slate-600 uppercase tracking-widest">Configura tu prueba:</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Size choice */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Cantidad de preguntas:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[5, 10, 17].map((size) => (
                      <button
                        id={`quiz-size-option-${size}`}
                        key={size}
                        type="button"
                        onClick={() => {
                          setQuizSize(size as any);
                          // Reset lessons selection filter if size is bigger than possible questions in single topic
                          if (size > 2) {
                            setFilterByLesson('all');
                          }
                        }}
                        className={`text-xs py-2 rounded-lg font-bold border transition-all ${
                          quizSize === size
                            ? 'bg-indigo-600 border-indigo-700 text-white shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/50'
                        }`}
                      >
                        {size} {size === 17 ? "🛡️" : ""}
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 block">17 preguntas cubre un ítem de cada sección.</span>
                </div>

                {/* Lesson filtering filter */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Filtrar por sección:</label>
                  <select
                    id="quiz-lesson-filter"
                    value={filterByLesson}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'all') {
                        setFilterByLesson('all');
                      } else {
                        setFilterByLesson(Number(val));
                        setQuizSize(2); // Keep small size for single lesson quizzes
                      }
                    }}
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="all">Todas las secciones (Recomendado)</option>
                    {lessonsData.map(l => (
                      <option key={l.id} value={l.id}>Tema {l.number}: {l.title}</option>
                    ))}
                  </select>
                  <span className="text-[10px] text-slate-400 block">Si filtras, la prueba se ajustará a las disponibles del tema.</span>
                </div>

              </div>
            </div>

            {/* Launch Button */}
            <div className="flex justify-end pt-2">
              <button
                id="quiz-launch-button"
                onClick={startQuiz}
                className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-extrabold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 group"
              >
                Comenzar Práctica
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>

          {/* Quick Statistics Sidebar & Tips */}
          <div id="quiz-statistics-sidebar" className="md:col-span-4 space-y-6">
            
            {/* Recent list history */}
            <div className="bg-white border border-slate-150 rounded-2xl p-4 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 pb-2.5 border-b border-slate-100">
                <Award className="w-4.5 h-4.5 text-amber-500" />
                Historial de pruebas
              </h3>

              {quizHistory.length === 0 ? (
                <div className="text-center py-6 text-slate-450 text-xs text-justify">
                  No has tomado exámenes en esta sesión aún. ¡Obtén tu primer puntaje completando la configuración de la izquierda!
                </div>
              ) : (
                <div className="space-y-2">
                  {quizHistory.map((item, idx) => {
                    const pct = Math.round((item.score / item.total) * 100);
                    return (
                      <div key={idx} className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100/50 transition-all">
                        <div>
                          <p className="text-[10px] font-bold text-slate-650">{item.date}</p>
                          <p className="text-[11px] text-slate-400">Preguntas evaluadas: {item.total}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs font-black px-2 py-1 rounded-md ${
                            pct >= 80 ? 'bg-emerald-100 text-emerald-800' :
                            pct >= 50 ? 'bg-indigo-100 text-indigo-800' : 'bg-red-50 text-red-650'
                          }`}>
                            {item.score}/{item.total}
                          </span>
                          <span className="text-[9px] block text-slate-400 mt-1">{pct}% correcto</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Vocabulary Study Flashcard Widget */}
            <div className="bg-gradient-to-r from-teal-900 to-emerald-950 text-emerald-100 rounded-2xl p-4 space-y-3 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-300">
                <Sparkles className="w-4 h-4 animate-bounce" /> Micro Vocabulary Flashcard
              </div>
              <p className="text-[11px] text-emerald-200/80 leading-relaxed text-justify">
                Un repaso rápido de la Unidad 1. ¿Sabes qué significa esta palabra clave?
              </p>
              
              {/* Random item view */}
              <div className="bg-emerald-900/40 border border-emerald-800/40 p-3 rounded-xl text-center relative group">
                <p className="text-xs text-emerald-300">Francés:</p>
                <p className="text-lg font-black font-mono text-white mt-0.5">Qui est-ce ?</p>
                
                <div className="mt-2 pt-2 border-t border-emerald-900/60 transition-all opacity-10 group-hover:opacity-100">
                  <p className="text-[10px] text-emerald-300">Traducción:</p>
                  <p className="text-sm font-bold text-teal-200">¿Quién es?</p>
                </div>
                <div className="absolute right-2 top-2">
                  <AudioButton text="Qui est-ce ?" size="sm" />
                </div>
              </div>
              <span className="text-[9.5px] text-emerald-300/60 block text-right">Pasa el mouse para revelar traducción</span>
            </div>

          </div>

        </div>

      ) : (
        
        // ACTIVE PLAYING WINDOW
        <div id="quiz-playing-frame" className="bg-white border border-slate-150 rounded-2xl p-6 shadow-md space-y-6">
          
          {/* Header Progress status */}
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-md uppercase tracking-wider">
                Français A1 · Evaluación activa
              </span>
              <h3 className="text-sm font-bold text-slate-800 mt-1">
                Pregunta {currentQuestionIndex + 1} de {questions.length}
              </h3>
            </div>
            
            {/* Score tracker & streaks */}
            <div className="flex items-center gap-3">
              {streakCount > 0 && (
                <span className="bg-amber-100 text-amber-800 border-amber-250 border px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1 animate-pulse">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  Racha: {streakCount}
                </span>
              )}

              <div className="text-right">
                <span className="text-xs font-bold text-slate-500">Puntaje actual:</span>
                <p className="text-base font-black text-slate-800 tracking-tight">{score} / {questions.length}</p>
              </div>
            </div>
          </div>

          {/* Progress Bar indicator */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 h-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
            />
          </div>

          {/* Core Question Layout */}
          <div className="space-y-4 pt-2">
            
            {/* Instructions box */}
            <div className="bg-slate-50 border-l-4 border-indigo-500 p-4 rounded-r-xl">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
                Instrucción del profesor
              </span>
              <p className="text-sm font-bold text-slate-700 mt-0.5">
                {currentQuestion.instruction}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Tema evaluado: <strong className="text-indigo-900 font-medium">{getTopicName(currentQuestion.lessonId)}</strong>
              </p>
            </div>

            {/* Prompt */}
            <div className="text-center py-6 px-4 bg-slate-50/50 rounded-2xl border border-slate-100">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Completa o responde correctamente:</p>
              <h4 className="text-xl md:text-2xl font-black text-indigo-950 font-mono mt-1.5">
                {currentQuestion.questionText}
              </h4>
            </div>

            {/* ANSWERS BLOCK ACCORDING TO TYPE */}
            
            {/* 1. Multiple Choice layout */}
            {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedOption === option;
                  const isCorrect = option === currentQuestion.correctAnswer;
                  
                  let optionClass = "bg-white border-slate-200 text-slate-700 hover:bg-slate-50/50 hover:border-slate-300";
                  
                  if (isAnswered) {
                    if (isCorrect) {
                      optionClass = "bg-emerald-50 border-emerald-500 text-emerald-900 border-2";
                    } else if (isSelected) {
                      optionClass = "bg-rose-50 border-rose-450 text-rose-900 border-2";
                    } else {
                      optionClass = "bg-slate-50 border-slate-100 text-slate-400 opacity-60";
                    }
                  } else if (isSelected) {
                    optionClass = "bg-indigo-50 border-indigo-600 text-indigo-900 shadow-sm border-2";
                  }

                  return (
                    <button
                      id={`quiz-option-button-${idx}`}
                      key={idx}
                      onClick={() => !isAnswered && setSelectedOption(option)}
                      disabled={isAnswered}
                      className={`p-4 rounded-xl text-left border text-sm font-mono font-bold transition-all flex items-center justify-between ${optionClass}`}
                    >
                      <span>{option}</span>
                      
                      {isAnswered ? (
                        isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        ) : isSelected ? (
                          <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                        ) : null
                      ) : (
                        <span className={`w-5 h-5 rounded-full border shrink-0 flex items-center justify-center text-xs font-sans ${
                          isSelected ? 'bg-indigo-600 border-indigo-700 text-white' : 'border-slate-300 text-slate-400'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* 2. Fill-in-the-blank or selection cards */}
            {(currentQuestion.type === 'fill-blank' || currentQuestion.type === 'conjugation' || currentQuestion.type === 'sort') && currentQuestion.options && (
              <div className="space-y-4 pt-2">
                <p className="text-xs text-slate-500 font-bold">Selecciona una de las tarjetas alternativas para completar la frase:</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedOption === option;
                    const isCorrect = option === currentQuestion.correctAnswer;
                    
                    let cardClass = "bg-white border-slate-200 text-slate-700 hover:border-slate-350 hover:bg-slate-50/50";
                    
                    if (isAnswered) {
                      if (isCorrect) {
                        cardClass = "bg-emerald-50 border-emerald-500 text-emerald-900 font-extrabold";
                      } else if (isSelected) {
                        cardClass = "bg-rose-50 border-rose-400 text-rose-950 font-extrabold";
                      } else {
                        cardClass = "bg-slate-100 text-slate-400 border-slate-150 opacity-50";
                      }
                    } else if (isSelected) {
                      cardClass = "bg-indigo-600 border-indigo-700 text-white font-extrabold shadow-sm";
                    }

                    return (
                      <button
                        id={`quiz-chip-btn-${option}`}
                        key={idx}
                        onClick={() => !isAnswered && setSelectedOption(option)}
                        disabled={isAnswered}
                        className={`p-3.5 rounded-xl border text-center text-sm font-semibold transition-all ${cardClass}`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Match Pairs Connector */}
            {currentQuestion.type === 'match' && currentQuestion.pairMatches && (
              <div className="pt-2 space-y-4">
                <p className="text-xs text-slate-500 font-bold">Instrucciones: Haz clic sobre un término en FRANCÉS y luego su respectivo en ESPAÑOL:</p>
                
                <div className="grid grid-cols-2 gap-6">
                  
                  {/* Left block (French) */}
                  <div className="space-y-2">
                    <p className="text-[10px] text-indigo-800 font-black tracking-widest uppercase">1. FRANCÉS</p>
                    <div className="space-y-2">
                      {currentQuestion.pairMatches.map((item) => {
                        const isMatched = matchedPairs[item.french] !== undefined;
                        const isCurrentSelection = selectedFrench === item.french;
                        
                        let itemClass = "bg-white border-slate-200 text-slate-800 hover:bg-slate-50";
                        if (isMatched) {
                          itemClass = "bg-emerald-50 border-emerald-300 text-emerald-800 cursor-not-allowed";
                        } else if (isCurrentSelection) {
                          itemClass = "bg-indigo-600 border-indigo-700 text-white font-black";
                        } else if (matchingError && isCurrentSelection) {
                          itemClass = "bg-rose-500 border-rose-600 text-white font-black";
                        }

                        return (
                          <button
                            id={`match-btn-fr-${item.french.replace(/\s+/g, '')}`}
                            key={item.french}
                            disabled={isMatched || isAnswered}
                            onClick={() => handleFrenchClick(item.french)}
                            className={`w-full p-3 text-left rounded-xl border text-xs font-mono font-semibold transition-all ${itemClass} flex justify-between items-center`}
                          >
                            <span>{item.french}</span>
                            {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right block (Spanish) */}
                  <div className="space-y-2">
                    <p className="text-[10px] text-teal-800 font-black tracking-widest uppercase">2. ESPAÑOL</p>
                    <div className="space-y-2">
                      {currentQuestion.pairMatches.map((item) => {
                        // Check if this spanish translation has been matched
                        const matchedKeys = Object.keys(matchedPairs);
                        const isMatched = matchedKeys.some(k => matchedPairs[k] === item.spanish);
                        const canBeClicked = selectedFrench !== null;
                        
                        let itemClass = "bg-white border-slate-200 text-slate-700";
                        if (isMatched) {
                          itemClass = "bg-emerald-50 border-emerald-200 text-emerald-700 cursor-not-allowed";
                        } else if (canBeClicked) {
                          itemClass = "bg-indigo-50 border-indigo-150 text-indigo-950 hover:bg-indigo-100/50 cursor-pointer";
                        }

                        return (
                          <button
                            id={`match-btn-sp-${item.spanish.replace(/\s+/g, '')}`}
                            key={item.spanish}
                            disabled={isMatched || isAnswered}
                            onClick={() => handleSpanishClick(item.spanish)}
                            className={`w-full p-3 text-left rounded-xl border text-xs font-semibold transition-all ${itemClass}`}
                          >
                            {item.spanish}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {matchingError && (
                  <p className="text-center text-xs text-rose-500 animate-pulse font-bold">
                    ❌ Combinación incorrecta. ¡Inténtalo de nuevo!
                  </p>
                )}
              </div>
            )}

          </div>

          {/* Verification Feedback alerts list */}
          {isAnswered && (
            <div className={`p-4 rounded-xl border ${
              // Evaluate matches separately or standard
              currentQuestion.type === 'match'
                ? 'bg-emerald-50 border-emerald-250 text-emerald-950'
                : (selectedOption === currentQuestion.correctAnswer)
                  ? 'bg-emerald-50 border-emerald-250 text-emerald-950'
                  : 'bg-rose-50 border-rose-250 text-rose-950'
            } flex items-start gap-3 mt-4`}>
              <div className="shrink-0 pt-0.5">
                {(currentQuestion.type === 'match' || selectedOption === currentQuestion.correctAnswer) ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                )}
              </div>

              <div className="flex-1 text-left space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider">
                  {(currentQuestion.type === 'match' || selectedOption === currentQuestion.correctAnswer) ? '¡Excelente trabajo!' : 'Detalle de la estructura:'}
                </p>
                <div className="text-sm">
                  {currentQuestion.type === 'match' ? (
                    <span>Has enlazado correctamente los cuatro términos del tema {currentQuestion.lessonId}.</span>
                  ) : (
                    <span>
                      Respuesta del sistema: <strong className="font-mono text-indigo-950 bg-white/50 px-1 py-0.5 rounded text-[13px]">{currentQuestion.correctAnswer}</strong>.
                    </span>
                  )}
                </div>
                
                {/* Audio helper for correct answer */}
                {currentQuestion.type !== 'match' && (
                  <div className="pt-2 flex items-center gap-2">
                    <span className="text-[11px] text-slate-500">Escucha la respuesta correcta:</span>
                    <AudioButton text={currentQuestion.correctAnswer as string} size="sm" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <button
              id="quiz-leave-button"
              onClick={() => {
                if (window.confirm("¿Seguro que deseas salir del examen? Tu progreso de esta prueba se perderá.")) {
                  setIsPlaying(false);
                }
              }}
              className="text-xs font-bold text-slate-450 hover:text-slate-600 transition-all"
            >
              Salir de la prueba
            </button>

            {/* Check/Next button */}
            {!isAnswered ? (
              currentQuestion.type !== 'match' && (
                <button
                  id="quiz-check-btn"
                  onClick={() => handleSubmitAnswer()}
                  disabled={!selectedOption && !typedAnswer}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-xs font-extrabold shadow-xs transition-all"
                >
                  Confirmar Respuesta
                </button>
              )
            ) : (
              <button
                id="quiz-next-btn"
                onClick={handleNextQuestion}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center gap-1"
              >
                {currentQuestionIndex + 1 === questions.length ? 'Finalizar Prueba' : 'Siguiente Pregunta'}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

      )}

      {/* COMPLETED SUCCESS DIALOG VIEW BADGE */}
      {!isPlaying && questions.length > 0 && (
        <div id="quiz-result-scorecard" className={`p-6 rounded-2xl border ${scoreBadgeDetails.color} shadow-sm space-y-6 text-center`}>
          <div className="flex justify-center flex-col items-center gap-2">
            <div className="p-4 bg-white/70 backdrop-blur-xs rounded-full border border-slate-200/50 shadow-xs relative">
              <span className="text-4xl">🏆</span>
              <div className="absolute -right-1 -top-1 bg-amber-500 text-white font-black text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded-full">
                Score
              </div>
            </div>
            
            <h3 className="text-xl font-black mt-2">
              {scoreBadgeDetails.title}
            </h3>
            
            <p className="text-sm max-w-xl mx-auto opacity-90 leading-relaxed text-justify">
              {scoreBadgeDetails.desc}
            </p>
          </div>

          <div className="max-w-xs mx-auto grid grid-cols-2 gap-4 bg-white/40 border border-slate-200/20 p-4 rounded-xl">
            <div className="text-center">
              <span className="text-[11px] font-bold text-slate-550 block">PUNTUACIÓN</span>
              <span className="text-3xl font-black text-slate-800 font-mono">
                {score} / {questions.length}
              </span>
            </div>
            <div className="text-center border-l border-slate-200/40">
              <span className="text-[11px] font-bold text-slate-550 block">PRECISIÓN</span>
              <span className="text-3xl font-black text-slate-800 font-mono">
                {Math.round((score / questions.length) * 100)}%
              </span>
            </div>
          </div>

          {/* Quick study mastering list helper */}
          {score < questions.length && (
            <div className="bg-white/80 border border-slate-200/60 text-left p-4 rounded-xl max-w-xl mx-auto space-y-2">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                💡 Recomendaciones Académicas:
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Para lograr el 100% en la Unidad 1 de Francés A1, te sugerimos repasar la pestaña de <strong>Estudio</strong> y marcar todas las lecciones como estudiadas. ¡El aprendizaje constante asegura la retención de vocabulario!
              </p>
            </div>
          )}

          {/* Restart helper */}
          <div>
            <button
              id="quiz-retry-btn"
              onClick={startQuiz}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" /> Volver a evaluar con preguntas nuevas
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
