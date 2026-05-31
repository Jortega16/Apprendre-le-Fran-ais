/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, Trophy, Sparkles, MessageSquare, CheckSquare, 
  HelpCircle, Star, UserPlus, Milestone, GraduationCap, ChevronRight, 
  PlusCircle, RefreshCw, Volume2, Search, Play, HelpCircle as QuestionMarkIcon, CheckCircle2, Award
} from 'lucide-react';
import { lessonsData, vocabulairesEssentiels, competenciesList, speakWord } from './data';
import LessonView from './components/LessonView';
import QuizView from './components/QuizView';
import AudioButton from './components/AudioButton';
import TutorChat from './components/TutorChat';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'lessons' | 'quiz' | 'dialogues' | 'glossary' | 'tutor'>('dashboard');
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [highScore, setHighScore] = useState<{ score: number; total: number } | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<number>(1);
  const [glossarySearch, setGlossarySearch] = useState('');

  // Dialogue Challenge state
  const [activeDialogueId, setActiveDialogueId] = useState<1 | 2>(1);
  const [shuffledDialogueChunks, setShuffledDialogueChunks] = useState<{ id: string; text: string; index: number }[]>([]);
  const [userSelectedSequence, setUserSelectedSequence] = useState<{ id: string; text: string; index: number }[]>([]);
  const [dialogueCompleted, setDialogueCompleted] = useState(false);
  const [dialogueError, setDialogueError] = useState(false);
  const [isPlayingFullAudio, setIsPlayingFullAudio] = useState(false);

  // Dialogue datasets
  const dialoguePresets = {
    1: {
      title: "Diálogo 1: Rencontre Formelle (Encuentro formal en la oficina / calle)",
      speakerA: "M. Philippe (Director)",
      speakerB: "Mme. Valérie (Profesora)",
      correctSequence: [
        { text: "Bonjour, madame. Comment vous appelez-vous ?", speaker: "A" },
        { text: "Bonjour ! Je m'appelle Valérie. Et vous ?", speaker: "B" },
        { text: "Je suis Philippe. Comment allez-vous ?", speaker: "A" },
        { text: "Ça va très bien, merci beaucoup. C'est un plaisir.", speaker: "B" },
        { text: "Merci ! Au revoir, bonne journée !", speaker: "A" },
        { text: "De rien ! Au revoir monsieur, à bientôt !", speaker: "B" }
      ]
    },
    2: {
      title: "Diálogo 2: Rencontre Informelle (Encuentro informal en el colegio)",
      speakerA: "Camille (Chica)",
      speakerB: "Hugo (Chico)",
      correctSequence: [
        { text: "Salut ! Comment ça va ?", speaker: "A" },
        { text: "Salut Camille ! Ça va bien, et toi ?", speaker: "B" },
        { text: "Comme ci comme ça. Tu as un crayon s'il te plaît ?", speaker: "A" },
        { text: "Oui, voilà ! C'est mon voisin qui l'a donné.", speaker: "B" },
        { text: "Merci beaucoup ! À demain Hugo !", speaker: "A" },
        { text: "De rien copine ! À demain !", speaker: "B" }
      ]
    }
  };

  // Load progress on mount
  useEffect(() => {
    try {
      const storedLessons = localStorage.getItem('french_a1_completed_lessons');
      if (storedLessons) {
        setCompletedLessons(JSON.parse(storedLessons));
      }
      const storedHighScore = localStorage.getItem('french_a1_high_score');
      if (storedHighScore) {
        setHighScore(JSON.parse(storedHighScore));
      }
    } catch (e) {
      console.error("Local storage loading error:", e);
    }
  }, []);

  // Sync completed chunks when dialogueId changes
  useEffect(() => {
    initDialoguePuzzle();
  }, [activeDialogueId]);

  // Handle toggle lesson completions
  const handleToggleCompleteLesson = (id: number) => {
    let updated;
    if (completedLessons.includes(id)) {
      updated = completedLessons.filter(x => x !== id);
    } else {
      updated = [...completedLessons, id];
    }
    setCompletedLessons(updated);
    try {
      localStorage.setItem('french_a1_completed_lessons', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Keep track of highscore
  const handleUpdateHighScore = (newScore: number, total: number) => {
    const currentHighRatio = highScore ? (highScore.score / highScore.total) : 0;
    const newRatio = newScore / total;
    
    if (newRatio >= currentHighRatio) {
      const updated = { score: newScore, total };
      setHighScore(updated);
      try {
        localStorage.setItem('french_a1_high_score', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Dialogue Puzzle logic
  const initDialoguePuzzle = () => {
    const chunks = dialoguePresets[activeDialogueId].correctSequence.map((phrase, idx) => ({
      id: `phrase-${idx}-${phrase.text.slice(0, 5)}`,
      text: `${phrase.speaker === 'A' ? '👤 Personne A' : '👥 Personne B'}: ${phrase.text}`,
      index: idx
    }));
    // Randomize
    const shuffled = [...chunks].sort(() => Math.random() - 0.5);
    setShuffledDialogueChunks(shuffled);
    setUserSelectedSequence([]);
    setDialogueCompleted(false);
    setDialogueError(false);
  };

  const handleSelectChunk = (chunk: { id: string; text: string; index: number }) => {
    if (dialogueCompleted) return;
    
    // Add to sequence
    const nextSeq = [...userSelectedSequence, chunk];
    setUserSelectedSequence(nextSeq);
    setShuffledDialogueChunks(prev => prev.filter(c => c.id !== chunk.id));
    
    // Auto evaluate as they add elements
    const currentIndexToCheck = nextSeq.length - 1;
    if (chunk.index !== currentIndexToCheck) {
      // Mistake made
      setDialogueError(true);
    } else {
      setDialogueError(false);
    }

    // Check complete
    if (nextSeq.length === dialoguePresets[activeDialogueId].correctSequence.length) {
      // Check if all indeed matched
      const valid = nextSeq.every((item, idx) => item.index === idx);
      if (valid) {
        setDialogueCompleted(true);
        setDialogueError(false);
      }
    }
  };

  const handleResetDialogue = () => {
    initDialoguePuzzle();
  };

  // Play full dialogue read-aloud chronologically
  const playDialogueChronologically = async () => {
    if (isPlayingFullAudio) return;
    setIsPlayingFullAudio(true);
    
    const sequence = dialoguePresets[activeDialogueId].correctSequence;
    for (let i = 0; i < sequence.length; i++) {
      await speakWord(sequence[i].text);
      // Wait beautiful delay between speakers
      await new Promise(r => setTimeout(r, 600));
    }
    setIsPlayingFullAudio(false);
  };

  // Compute reactive dynamic competencies mastery
  const activeCompetencyReport = useMemo(() => {
    return [
      {
        text: "✓ Saludar y despedirse correctamente.",
        isDone: completedLessons.includes(3) && completedLessons.includes(6),
        theme: "Temas 3 y 6"
      },
      {
        text: "✓ Presentarse y decir su nombre.",
        isDone: completedLessons.includes(1) && completedLessons.includes(2),
        theme: "Temas 1 y 2"
      },
      {
        text: "✓ Preguntar e identificar personas.",
        isDone: completedLessons.includes(7),
        theme: "Tema 7"
      },
      {
        text: "✓ Utilizar los artículos un, une, des.",
        isDone: completedLessons.includes(9),
        theme: "Tema 9"
      },
      {
        text: "✓ Conjugar los verbos être y s'appeler.",
        isDone: completedLessons.includes(2) && completedLessons.includes(10),
        theme: "Temas 2 y 10"
      },
      {
        text: "✓ Describir personas con adjetivos básicos.",
        isDone: completedLessons.includes(11),
        theme: "Tema 11"
      },
      {
        text: "✓ Reconocer objetos escolares.",
        isDone: completedLessons.includes(13),
        theme: "Tema 13"
      },
      {
        text: "✓ Decir días, meses y fechas.",
        isDone: completedLessons.includes(14) && completedLessons.includes(15),
        theme: "Temas 14 y 15"
      },
      {
        text: "✓ Expresar nacionalidades.",
        isDone: completedLessons.includes(17),
        theme: "Tema 17"
      },
      {
        text: "✓ Diferenciar el uso de tu y vous.",
        isDone: completedLessons.includes(12),
        theme: "Tema 12"
      },
      {
        text: "✓ Formular preguntas simples de identificación personal.",
        isDone: completedLessons.includes(1) && completedLessons.includes(7),
        theme: "Temas 1 y 7"
      }
    ];
  }, [completedLessons]);

  const globalPercentageProgress = useMemo(() => {
    // 17 lessons total
    const lessonWeight = completedLessons.length / 17;
    // Scoreweight
    const quizPct = highScore ? (highScore.score / highScore.total) : 0;
    
    // Balanced metrics
    const totalMetric = (lessonWeight * 0.7) + (quizPct * 0.3);
    return Math.round(totalMetric * 100);
  }, [completedLessons, highScore]);

  // Filter glossary
  const filteredGlossary = useMemo(() => {
    return vocabulairesEssentiels.filter(item => 
      item.french.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      item.spanish.toLowerCase().includes(glossarySearch.toLowerCase())
    );
  }, [glossarySearch]);

  return (
    <div id="french-app-root" className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-100">
      
      {/* Visual Accent top tricolore bar representing France colors */}
      <div id="tricolore-header-bar" className="h-2 w-full flex">
        <div className="bg-blue-600 flex-1"></div>
        <div className="bg-white flex-1"></div>
        <div className="bg-red-500 flex-1"></div>
      </div>

      {/* Primary Header/Branding Area */}
      <header id="main-navigation-header" className="bg-white border-b border-slate-150 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <span className="text-3xl">🇫🇷</span>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-black text-slate-900 tracking-tight font-display uppercase">Apprendre le Français</h1>
                <span className="bg-indigo-100 text-indigo-800 text-[10px] font-black px-1.5 py-0.5 rounded uppercase">A1 · Unidad 1</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Se présenter, saluer et identifier des personnes</p>
            </div>
          </div>

          {/* Interactive Navigation Elements */}
          <nav className="flex space-x-1 bg-slate-100 p-1 rounded-xl">
            {[
              { id: 'dashboard', label: 'Inicio', icon: Award },
              { id: 'lessons', label: 'Estudio (17)', icon: BookOpen },
              { id: 'quiz', label: 'Quiz', icon: Trophy },
              { id: 'dialogues', label: 'Diálogos', icon: MessageSquare },
              { id: 'glossary', label: 'Glosario', icon: Search },
              { id: 'tutor', label: 'Tutor IA', icon: Sparkles }
            ].map(tab => (
              <button
                id={`navbar-tab-${tab.id}`}
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-white/40'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Container Wrapper */}
      <main id="app-main-content-layout" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        
        {/* TAB 1: DASHBOARD OUTLINE */}
        {activeTab === 'dashboard' && (
          <div id="dashboard-tab-portal" className="space-y-6">
            
            {/* Main Welcome Dashboard Hero Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-sm">
              <div className="absolute right-0 top-0 opacity-10 pointer-events-none translate-x-10 translate-y-[-10px]">
                <GraduationCap className="w-72 h-72" />
              </div>

              <div className="max-w-xl space-y-4">
                <span className="inline-flex items-center gap-1.5 bg-indigo-500/30 text-indigo-300 border border-indigo-400/20 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Bonjour, Bienvenido al aprendizaje del francés
                </span>
                
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  ¡Domina las presentaciones, saludos e identificación de personas!
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed text-justify">
                  Esta plataforma está equipada con recursos para que practiques los 17 temas obligatorios de la Unidad 1 del nivel A1. Escucha dialectos reales con el modulador de voz integrado, recrea conversaciones guiadas y ponte a prueba con exámenes cortos.
                </p>

                {/* Progress stats outline */}
                <div className="pt-2 flex flex-wrap items-center gap-6">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Lecciones estudiadas</span>
                    <strong className="text-xl md:text-2xl font-black text-white font-mono">{completedLessons.length} / 17</strong>
                  </div>
                  <div className="border-l border-slate-700/60 pl-6">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Calificación Examen</span>
                    <strong className="text-xl md:text-2xl font-black text-indigo-300 font-mono">
                      {highScore ? `${highScore.score} / ${highScore.total}` : 'Sin evaluar --'}
                    </strong>
                  </div>
                  <div className="border-l border-slate-700/60 pl-6">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Nivel de Maestría global</span>
                    <strong className="text-xl md:text-2xl font-black text-emerald-400 font-mono">{globalPercentageProgress}%</strong>
                  </div>
                </div>
              </div>

              {/* Progress Indicator Radial circle fallback */}
              <div className="absolute right-6 bottom-6 bg-black/25 p-4 rounded-2xl border border-white/5 flex flex-col items-center">
                <span className="text-xs font-bold text-slate-300">Progreso Total</span>
                <span className="text-2xl font-black text-emerald-400 mt-0.5">{globalPercentageProgress}%</span>
                <button
                  id="dashboard-resume-btn"
                  onClick={() => setActiveTab('lessons')}
                  className="mt-2 text-[10px] font-black uppercase text-indigo-300 hover:text-white transition-all"
                >
                  Estudiar ahora →
                </button>
              </div>

            </div>

            {/* Grid for Competencies & Quick study prompts */}
            <div id="dashboard-bento" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Bento: Unit Competencies Tracker (Completes dynamically as user studies!) */}
              <div id="dashboard-competencies-card" className="lg:col-span-8 bg-white border border-slate-150 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-800">Competencias de la Unidad 1</h3>
                    <p className="text-xs text-slate-500">Estas metas se completan solos al estudiar sus respectivos temas en la pestaña Estudio</p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
                    {activeCompetencyReport.filter(x => x.isDone).length} completadas
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {activeCompetencyReport.map((comp, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-start gap-2.5 transition-all ${
                        comp.isDone
                          ? "bg-emerald-50/40 border-emerald-150 text-slate-800"
                          : "bg-slate-50/50 border-slate-150 text-slate-400"
                      }`}
                    >
                      <span className={`text-base shrink-0 select-none ${comp.isDone ? 'text-emerald-600' : 'text-slate-300'}`}>
                        {comp.isDone ? '🟢' : '🔘'}
                      </span>
                      <div className="text-left font-medium text-xs leading-relaxed">
                        <p className={comp.isDone ? 'text-slate-800 font-semibold' : 'text-slate-500'}>
                          {comp.text}
                        </p>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                          Vincular: {comp.theme}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Bento: Useful Quick Actions & Essential list */}
              <div id="dashboard-quickreview-card" className="lg:col-span-4 bg-white border border-slate-150 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
                    💡 Tips académicos veloces
                  </h3>
                  
                  <div className="space-y-4 pt-3">
                    <div className="space-y-1">
                      <h4 className="text-xs font-semibold text-indigo-700">Pronunciación interactiva:</h4>
                      <p className="text-xs text-slate-650 text-justify">
                        En cualquier fila o ejemplo verás un botón de reproductor de audio. Puedes activar el **modo tortuga (0.6x)** para escuchar la colocación silábica del francés lentamente.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-semibold text-emerald-700">Diferencia entre SU y TU:</h4>
                      <p className="text-xs text-slate-650 text-justify">
                        Usa **TU** (tutoiement) para amigos, familia y jóvenes. Utiliza **VOUS** (vouvoiement) obligatoriamente para tratos respetuosos o múltiples personas. Puedes repasar esto en el **Tema 12**.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Micro Action Button list */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <button
                    onClick={() => setActiveTab('quiz')}
                    className="w-full text-center py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold transition-all block focus:outline-none"
                  >
                    Prueba tu nivel con el Quiz →
                  </button>
                  <button
                    onClick={() => setActiveTab('dialogues')}
                    className="w-full text-center py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all block focus:outline-none"
                  >
                    Ir al taller de diálogos
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB 2: LESSONS VIEWER */}
        {activeTab === 'lessons' && (
          <div id="lessons-tab-portal">
            <LessonView
              completedLessons={completedLessons}
              onToggleCompleteLesson={handleToggleCompleteLesson}
              activeLessonId={activeLessonId}
              setActiveLessonId={setActiveLessonId}
            />
          </div>
        )}

        {/* TAB 3: COMPLETE EXAM QUIZ */}
        {activeTab === 'quiz' && (
          <div id="quiz-tab-portal">
            <QuizView
              completedLessons={completedLessons}
              onToggleCompleteLesson={handleToggleCompleteLesson}
              onUpdateHighScore={handleUpdateHighScore}
            />
          </div>
        )}

        {/* TAB 4: INTERACTIVE DIALOGUE PUZZLES */}
        {activeTab === 'dialogues' && (
          <div id="dialogues-tab-portal" className="space-y-6">
            
            <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-800">Reconstructor de Diálogos</h2>
                  <p className="text-xs text-slate-500">Arrastra u ordena la conversación secuencialmente. Haz clic en las frases en su orden lógico de menor a mayor.</p>
                </div>
                
                {/* Switch between dialogues */}
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button
                    id="dialogue-selector-1"
                    onClick={() => setActiveDialogueId(1)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeDialogueId === 1 ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Formal (Vous)
                  </button>
                  <button
                    id="dialogue-selector-2"
                    onClick={() => setActiveDialogueId(2)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeDialogueId === 2 ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Informal (Tu)
                  </button>
                </div>
              </div>

              {/* Theme title */}
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-indigo-700">Tópico Activo</span>
                <p className="text-xs font-extrabold text-slate-800 mt-0.5">{dialoguePresets[activeDialogueId].title}</p>
              </div>

              {/* Challenge Workspace */}
              <div className="crypto-sandbox-grid grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* 1. Raw Chunks left */}
                <div id="chunks-well" className="space-y-3 bg-slate-50 p-4 border border-slate-200 rounded-xl min-h-[300px]">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">1. Frases mezcladas:</h3>
                  
                  {shuffledDialogueChunks.length === 0 && !dialogueCompleted ? (
                    <div className="text-center py-12 text-slate-400 text-xs">
                      ¡Todas las frases se han puesto en la bandeja de la derecha!
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {shuffledDialogueChunks.map(chunk => (
                        <button
                          id={`dialogue-chunk-select-${chunk.id}`}
                          key={chunk.id}
                          onClick={() => handleSelectChunk(chunk)}
                          className="w-full p-3 text-left border border-slate-250 bg-white font-mono font-bold text-xs rounded-lg text-indigo-950 hover:border-indigo-600 shadow-xs transition-all active:scale-95 block"
                        >
                          {chunk.text}
                        </button>
                      ))}
                    </div>
                  )}

                  {shuffledDialogueChunks.length > 0 && (
                    <p className="text-[10px] text-slate-400 italic mt-2 text-center">Haz clic en la frase que va primero.</p>
                  )}
                </div>

                {/* 2. Sorted Workspace right */}
                <div id="sort-workspace" className="space-y-3 bg-white p-4 border border-slate-200 rounded-xl min-h-[300px] flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">2. Tu diálogo reconstruido:</h3>
                      <button
                        id="reset-dialogue-btn"
                        onClick={handleResetDialogue}
                        className="text-[10px] font-bold text-indigo-600 flex items-center gap-1 hover:underline"
                      >
                        <RefreshCw className="w-3 h-3" /> Reiniciar diálogo
                      </button>
                    </div>

                    {userSelectedSequence.length === 0 ? (
                      <div className="text-center py-12 text-slate-350 text-xs text-justify italic">
                        Haz clic en las frases de la izquierda para alinearlas cronológicamente. ¡El profesor te evaluará de inmediato!
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {userSelectedSequence.map((item, index) => {
                          const isCorrectSpot = item.index === index;
                          return (
                            <div
                              id={`sorted-chunk-card-${index}`}
                              key={index}
                              className={`p-3 border rounded-lg text-xs font-mono font-semibold flex items-center justify-between ${
                                isCorrectSpot
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                                  : 'bg-rose-50 border-rose-350 text-rose-950 animate-pulse'
                              }`}
                            >
                              <span>{index + 1}. {item.text}</span>
                              <div className="flex items-center gap-1.5 ml-2 shrink-0">
                                <AudioButton text={item.text.replace(/^(👤 Personne A:|👥 Personne B:)\s*/, '')} size="sm" />
                                {isCorrectSpot ? (
                                  <span className="text-[10px] bg-emerald-500 text-white rounded px-1 text-[9px] uppercase font-bold">OK ✓</span>
                                ) : (
                                  <span className="text-[10px] bg-rose-500 text-white rounded px-1 text-[9px] uppercase font-bold">Error</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Errors & Complete feedbacks messages */}
                  <div className="pt-3 border-t border-slate-100">
                    {dialogueError && (
                      <div className="p-3 bg-rose-50 border border-rose-250 text-rose-950 rounded-xl text-xs flex items-center gap-2">
                        <span>⚠️</span>
                        <span>¡Oh! Esa frase no se coloca en esta secuencia. Haz clic en <strong>Reiniciar diálogo</strong> para intentarlo de nuevo.</span>
                      </div>
                    )}

                    {dialogueCompleted && (
                      <div className="p-4 bg-emerald-50 border border-emerald-250 rounded-xl text-emerald-950 space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <p className="text-xs font-black uppercase tracking-wider">¡Éxito absoluto! Diálogo correcto.</p>
                        </div>
                        
                        <p className="text-xs opacity-90 leading-relaxed text-justify">
                          Has alineado correctamente las {dialoguePresets[activeDialogueId].correctSequence.length} frases del diálogo en francés en su flujo correcto. Puedes escuchar toda la conversación leída de corrido haciendo clic en el banner inferior.
                        </p>

                        <div className="pt-2 border-t border-emerald-250 flex justify-end">
                          <button
                            id="dialogue-audio-sequence-launcher"
                            onClick={playDialogueChronologically}
                            disabled={isPlayingFullAudio}
                            className="px-4 py-2 bg-indigo-600 hover:bg-slate-900 disabled:bg-slate-350 text-white font-extrabold rounded-lg text-xs leading-tight shadow-xs flex items-center gap-1.5 focus:outline-none"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            {isPlayingFullAudio ? "Reproduciendo diálogo..." : "Reproducir diálogo completo 🎙️"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB 5: INSTANT GLOSSARY */}
        {activeTab === 'glossary' && (
          <div id="glossary-tab-portal" className="space-y-6">
            
            <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-800">Glosario Esencial de la Unidad 1</h2>
                  <p className="text-xs text-slate-500">Consulta los principales vocablos obligatorios de este módulo inicial A1</p>
                </div>

                {/* Instant Search input */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="glossary-search-input"
                    type="text"
                    value={glossarySearch}
                    onChange={(e) => setGlossarySearch(e.target.value)}
                    placeholder="Filtrar por palabra o traducción..."
                    className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Glossary Grid / Results table */}
              <div className="border border-slate-150 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-150">
                      <th className="p-3 text-xs font-black text-slate-500 uppercase tracking-widest">Francés</th>
                      <th className="p-3 text-xs font-black text-slate-500 uppercase tracking-widest">Español</th>
                      <th className="p-3 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Opciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredGlossary.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center p-8 text-slate-400 text-xs">
                          No se encontraron palabras que coincidan con la búsqueda.
                        </td>
                      </tr>
                    ) : (
                      filteredGlossary.map((item, idx) => (
                        <tr key={idx} className="hover:bg-indigo-50/10 transition-all">
                          <td className="p-3 font-semibold text-indigo-950 font-mono text-xs">
                            {item.french}
                          </td>
                          <td className="p-3 text-xs text-slate-650 font-medium">
                            {item.spanish}
                          </td>
                          <td className="p-3 text-right">
                            <AudioButton text={item.french} size="sm" />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Extra checklist indicators */}
              <div className="bg-slate-50 p-4 border border-slate-150 rounded-xl">
                <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">💡 Recomendación académica:</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-1 text-justify">
                  El glosario esencial recopila vocablos que sí o sí debes retener para tu nivel. Escuchar la conjugación e interactuar regularmente con el Quiz garantiza tu avance al módulo de Francés A2 cómodamente.
                </p>
              </div>

            </div>

          </div>
        )}

        {/* TAB 6: TUTOR CHAT */}
        {activeTab === 'tutor' && (
          <div id="tutor-tab-portal" className="space-y-6">
            <TutorChat />
          </div>
        )}

      </main>

      {/* Footer Branding credits */}
      <footer id="global-application-footer" className="bg-white border-t border-slate-150 py-6 mt-12 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-550 text-xs">
          
          <div className="flex items-center gap-2">
            <span className="text-lg">🎓</span>
            <p className="font-semibold text-slate-700">Competencias de Unidad 1 Francés A1 · Se présenter & saluer</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] text-slate-400">Desarrollo local · 2026</span>
            <div className="flex space-x-1">
              <span className="h-3 w-5 bg-blue-600 block rounded shadow-xs"></span>
              <span className="h-3 w-5 bg-white border border-slate-200 block rounded shadow-xs"></span>
              <span className="h-3 w-5 bg-red-600 block rounded shadow-xs"></span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
