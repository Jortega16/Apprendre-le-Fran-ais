/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { BookOpen, Search, CheckCircle, Info, ArrowRight, UserCheck, Calendar, Eye, VolumeX, Sparkles, Smile } from 'lucide-react';
import { Lesson, lessonsData, speakWord } from '../data';
import AudioButton from './AudioButton';

interface LessonViewProps {
  completedLessons: number[];
  onToggleCompleteLesson: (id: number) => void;
  activeLessonId: number;
  setActiveLessonId: (id: number) => void;
}

export default function LessonView({
  completedLessons,
  onToggleCompleteLesson,
  activeLessonId,
  setActiveLessonId
}: LessonViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [genderToggle, setGenderToggle] = useState<'masculine' | 'feminine'>('masculine');

  // Interactive sandbox states
  const [sandboxName, setSandboxName] = useState('');
  const [sandboxPronoun, setSandboxPronoun] = useState('Je');
  const [sandboxVerbeEtre, setSandboxVerbeEtre] = useState('Je');

  // Filter lessons based on search
  const filteredLessons = useMemo(() => {
    return lessonsData.filter(
      (lesson) =>
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.number.includes(searchQuery)
    );
  }, [searchQuery]);

  const activeLesson = useMemo(() => {
    return lessonsData.find((l) => l.id === activeLessonId) || lessonsData[0];
  }, [activeLessonId]);

  // Selected Sandbox helper values
  const currentSAppelerConjugation = useMemo(() => {
    switch (sandboxPronoun) {
      case 'Je': return "m'appelle";
      case 'Tu': return "t'appelles";
      case 'Il': return "s'appelle";
      case 'Elle': return "s'appelle";
      case 'Nous': return "nous appelons";
      case 'Vous': return "vous devez"; // just standard
      case 'Ils': return "s'appellent";
      case 'Elles': return "s'appellent";
      default: return "m'appelle";
    }
  }, [sandboxPronoun]);

  const currentEtreConjugation = useMemo(() => {
    switch (sandboxVerbeEtre) {
      case 'Je': return "suis";
      case 'Tu': return "es";
      case 'Il':
      case 'Elle': return "est";
      case 'Nous': return "sommes";
      case 'Vous': return "êtes";
      case 'Ils':
      case 'Elles': return "sont";
      default: return "suis";
    }
  }, [sandboxVerbeEtre]);

  // Months of the year fallback helpers
  const isCurrentMonth = (frenchName: string) => {
    const currentM = new Date().getMonth(); // 0-11
    const monthsFr = [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin', 
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ];
    return monthsFr[currentM] === frenchName.toLowerCase();
  };

  return (
    <div id="lesson-view-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Lesson Directory Column */}
      <div id="lesson-directory-column" className="lg:col-span-4 bg-white rounded-2xl border border-slate-150 p-4 shadow-sm flex flex-col h-[650px]">
        <div id="directory-header" className="mb-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Tabla de Contenidos
          </h2>
          <p className="text-xs text-slate-500 mt-1">17 Lecciones fundamentales para nivel A1</p>
          
          {/* Search Input */}
          <div id="lesson-search-container" className="relative mt-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="lesson-search-input"
              type="text"
              placeholder="Buscar tema (ej. être, saludos)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-sm pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Scrollable Lesson Index */}
        <div id="lesson-scroll-list" className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
          {filteredLessons.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              No se encontraron lecciones que coincidan con la búsqueda.
            </div>
          ) : (
            filteredLessons.map((lesson) => {
              const isCompleted = completedLessons.includes(lesson.id);
              const isActive = lesson.id === activeLessonId;
              
              return (
                <button
                  id={`lesson-selector-btn-${lesson.id}`}
                  key={lesson.id}
                  onClick={() => setActiveLessonId(lesson.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all border ${
                    isActive
                      ? "bg-indigo-600 border-indigo-700 text-white shadow-sm shadow-indigo-100"
                      : "hover:bg-slate-50 border-transparent text-slate-700"
                  } flex items-center justify-between group`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`text-xs font-bold leading-none w-6 h-6 rounded-full flex items-center justify-center ${
                      isActive ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-600"
                    }`}>
                      {lesson.number}
                    </span>
                    <div className="truncate">
                      <p className={`text-sm font-semibold truncate ${isActive ? "text-white" : "text-slate-800"}`}>
                        {lesson.title}
                      </p>
                      <p className={`text-[11px] truncate ${isActive ? "text-indigo-200" : "text-slate-400"}`}>
                        {lesson.subtitle}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 ml-2 shrink-0">
                    {isCompleted && (
                      <CheckCircle className={`w-4 h-4 ${isActive ? "text-indigo-200" : "text-emerald-500"}`} />
                    )}
                    <span className={`text-[10px] uppercase tracking-wider scale-90 ${
                      isActive ? "text-indigo-200" : "text-slate-300 group-hover:text-slate-400"
                    }`}>
                      Ver →
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Progress Quick Banner */}
        <div id="directory-footer-badge" className="mt-4 pt-3 border-t border-slate-100">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-100/50 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-800">Tu progreso</p>
              <p className="text-[10px] text-emerald-600">Completa las de arriba</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-extrabold text-emerald-700">
                {completedLessons.length} / 17
              </span>
              <p className="text-[9px] text-slate-400">temas marcados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Detail Reader Column */}
      <div id="lesson-reader-column" className="lg:col-span-8 space-y-6">
        
        {/* Main Lesson Card */}
        <div id="lesson-container-card" className="bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          
          {/* Cover Header */}
          <div className="p-6 bg-gradient-to-r from-indigo-900 via-indigo-955 to-slate-900 text-white relative">
            <div className="absolute right-6 top-6 opacity-10 pointer-events-none">
              <BookOpen className="w-24 h-24 stroke-[1]" />
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 bg-indigo-500/30 border border-indigo-400/20 text-indigo-300 rounded-full text-[11px] font-semibold uppercase tracking-wider">
                Unidad 1 · Francés A1
              </span>
              <span className="px-2.5 py-0.5 bg-slate-700/50 text-slate-300 rounded-full text-[11px] font-medium">
                Tema {activeLesson.number} de 17
              </span>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
              {activeLesson.title}
            </h1>
            <p className="text-sm text-indigo-200 mt-1 font-medium flex items-center gap-1.5">
              <span>{activeLesson.subtitle}</span>
            </p>
            
            <p className="text-xs text-slate-300 mt-3 max-w-2xl text-justify leading-relaxed bg-black/15 p-2 rounded-lg">
              {activeLesson.content}
            </p>
          </div>

          {/* Core Content Body */}
          <div className="p-6 flex-1 space-y-6">
            
            {/* General Description Section */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-4 h-4 text-indigo-500" />
                Explicación y Uso
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed text-justify">
                {activeLesson.details.description}
              </p>
            </div>

            {/* Structured Table of Content */}
            {activeLesson.details.tableRows && activeLesson.details.tableRows.length > 0 && (
              <div id="lesson-table-container" className="border border-slate-150 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-150">
                      {activeLesson.details.tableHeaders?.map((header, idx) => (
                        <th key={idx} className="p-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                      <th className="p-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
                        Pronunciación
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeLesson.details.tableRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-indigo-50/20 transition-all">
                        <td className="p-3 text-sm font-semibold text-indigo-950 font-mono">
                          {row.french}
                        </td>
                        <td className="p-3 text-sm text-slate-600">
                          {row.spanish}
                        </td>
                        {row.note !== undefined && (
                          <td className="p-3 text-xs text-slate-400 italic">
                            {row.note}
                          </td>
                        )}
                        <td className="p-3 text-right">
                          <AudioButton text={row.french} size="sm" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Standard Verb Conjugation Cards */}
            {activeLesson.details.verbStructure && (
              <div id="verb-conjugation-grid" className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Estudio de conjugación:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {activeLesson.details.verbStructure.map((v, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200/60 p-3 rounded-xl flex flex-col justify-between hover:border-indigo-200 transition-all hover:bg-indigo-50/10">
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{v.pronoun}</div>
                      <div className="text-base font-extrabold text-indigo-950 font-mono my-1">{v.base}</div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[10px] text-slate-500">¿Cómo suena?</span>
                        <AudioButton text={v.full} size="sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* INTERACTIVE MINI SANDBOXES BY LESSON */}
            {/* These add stunning practical touch-points directly into the text */}
            
            {/* L1 & L2: Verbos y Nombres Builder Sandbox */}
            {(activeLesson.id === 1 || activeLesson.id === 2) && (
              <div id="interactive-name-builder" className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <span className="p-1 bg-amber-100 text-amber-700 rounded-md">💻</span>
                  <p className="text-xs font-extrabold text-amber-800 uppercase tracking-wider">Laboratorio Práctico: S'appeler</p>
                </div>
                
                <p className="text-xs text-slate-600">Completa la oración interactiva y reprodúcela en voz alta:</p>
                
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-slate-700">Pronombre:</span>
                    <select
                      id="sandbox-pronoun-select"
                      value={sandboxPronoun}
                      onChange={(e) => setSandboxPronoun(e.target.value)}
                      className="bg-white border border-slate-300 rounded-lg text-sm px-2.5 py-1.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    >
                      {["Je", "Tu", "Il", "Elle", "Nous", "Vous", "Ils", "Elles"].map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div className="text-base font-extrabold text-indigo-800 font-mono">
                    ➡️ {currentSAppelerConjugation}
                  </div>

                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm font-semibold text-slate-700">Nombre:</span>
                    <input
                      id="sandbox-name-input"
                      type="text"
                      placeholder="Camille, Nicolas..."
                      value={sandboxName}
                      onChange={(e) => setSandboxName(e.target.value)}
                      className="bg-white border border-slate-300 rounded-lg text-sm px-2.5 py-1 flex-1 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-amber-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm bg-amber-100/60 text-amber-950 px-3 py-1.5 rounded-lg font-mono">
                    <span className="text-slate-400">Frase formada:</span> <strong className="text-indigo-900">{sandboxPronoun} {currentSAppelerConjugation} {sandboxName || "[Nombre]"}</strong>
                  </div>
                  <AudioButton text={`${sandboxPronoun} ${currentSAppelerConjugation} ${sandboxName || "Nicolas"}`} />
                </div>
              </div>
            )}

            {/* L8 & L11 & L17: Feminine vs Masculine Gender Playground */}
            {(activeLesson.id === 8 || activeLesson.id === 11 || activeLesson.id === 17) && (
              <div id="gender-sandbox" className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1 bg-emerald-100 text-emerald-700 rounded-md">👥</span>
                    <p className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">Morfología de Género: Masculino vs Femenino</p>
                  </div>
                  
                  {/* Toggle */}
                  <div className="inline-flex rounded-lg bg-emerald-100 p-0.5">
                    <button
                      id="gender-toggle-masc"
                      onClick={() => setGenderToggle('masculine')}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                        genderToggle === 'masculine' ? 'bg-white text-emerald-800 shadow-xs' : 'text-emerald-600 hover:text-emerald-800'
                      }`}
                    >
                      Masculino (un)
                    </button>
                    <button
                      id="gender-toggle-fem"
                      onClick={() => setGenderToggle('feminine')}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                        genderToggle === 'feminine' ? 'bg-white text-emerald-800 shadow-xs' : 'text-emerald-600 hover:text-emerald-800'
                      }`}
                    >
                      Femenino (une)
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-500">Haz clic para escuchar el impacto fonético al cambiar el género:</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="bg-white p-3 rounded-lg border border-slate-100 flex items-center justify-between shadow-xs">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Amigo</p>
                      <p className="text-sm font-bold text-slate-800 font-mono mt-0.5">
                        {genderToggle === 'masculine' ? "un ami" : "une amie"}
                      </p>
                    </div>
                    <AudioButton text={genderToggle === 'masculine' ? "un ami" : "une amie"} />
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-100 flex items-center justify-between shadow-xs">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Vecino</p>
                      <p className="text-sm font-bold text-slate-800 font-mono mt-0.5">
                        {genderToggle === 'masculine' ? "un voisin" : "une voisine"}
                      </p>
                    </div>
                    <AudioButton text={genderToggle === 'masculine' ? "un voisin" : "une voisine"} />
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-100 flex items-center justify-between shadow-xs">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Nacionalidad (Nicaragüense)</p>
                      <p className="text-sm font-bold text-slate-800 font-mono mt-0.5">
                        {genderToggle === 'masculine' ? "Il est nicaraguayen" : "Elle est nicaraguayenne"}
                      </p>
                    </div>
                    <AudioButton text={genderToggle === 'masculine' ? "Il est nicaraguayen" : "Elle est nicaraguayenne"} />
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-100 flex items-center justify-between shadow-xs">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Adjetivo (Hablador / Inte.)</p>
                      <p className="text-sm font-bold text-slate-800 font-mono mt-0.5">
                        {genderToggle === 'masculine' ? "Il est bavard et intelligent" : "Elle est bavarde et intelligente"}
                      </p>
                    </div>
                    <AudioButton text={genderToggle === 'masculine' ? "Il est bavard et intelligent" : "Elle est bavarde et intelligente"} />
                  </div>
                </div>
              </div>
            )}

            {/* L10: Verbe Être Interactive Conjugation Panel */}
            {activeLesson.id === 10 && (
              <div id="interactive-etre-builder" className="p-4 bg-sky-50 border border-sky-200 rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <span className="p-1 bg-sky-100 text-sky-700 rounded-md">⭐</span>
                  <p className="text-xs font-extrabold text-sky-800 uppercase tracking-wider">Laboratorio Práctico: Verbe Être</p>
                </div>
                
                <p className="text-xs text-slate-650">Forma oraciones combinando el sujeto y el adjetivo:</p>
                
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-700">Pronombre:</span>
                    <select
                      id="sandbox-etre-select"
                      value={sandboxVerbeEtre}
                      onChange={(e) => setSandboxVerbeEtre(e.target.value)}
                      className="bg-white border border-slate-300 rounded-lg text-sm px-2 py-1 focus:ring-1 focus:ring-sky-500 focus:outline-none"
                    >
                      {["Je", "Tu", "Il", "Elle", "Nous", "Vous", "Ils", "Elles"].map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div className="text-base font-extrabold text-sky-800 font-mono">
                    ➡️ {currentEtreConjugation}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-700">Estado / Atributo:</span>
                    <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono text-indigo-900">
                      {(sandboxVerbeEtre === 'Elle' || sandboxVerbeEtre === 'Elles') ? 'intelligente(s)' : 'intelligent(s)'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-sky-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm bg-sky-100/60 text-sky-950 px-3 py-1.5 rounded-lg font-mono">
                    <span className="text-slate-400">Frase:</span> <strong className="text-indigo-900">
                      {sandboxVerbeEtre} {currentEtreConjugation} {
                        sandboxVerbeEtre === 'Nous' ? 'intelligents' :
                        sandboxVerbeEtre === 'Vous' ? 'intelligents' :
                        sandboxVerbeEtre === 'Ils' ? 'intelligents' :
                        sandboxVerbeEtre === 'Elles' ? 'intelligentes' :
                        sandboxVerbeEtre === 'Elle' ? 'intelligente' : 'intelligent'
                      }
                    </strong>
                  </div>
                  <AudioButton text={`${sandboxVerbeEtre} ${currentEtreConjugation} ${
                    sandboxVerbeEtre === 'Nous' || sandboxVerbeEtre === 'Vous' || sandboxVerbeEtre === 'Ils' ? 'intelligents' :
                    sandboxVerbeEtre === 'Elles' ? 'intelligentes' :
                    sandboxVerbeEtre === 'Elle' ? 'intelligente' : 'intelligent'
                  }`} />
                </div>
              </div>
            )}

            {/* L13: Flashcards de útiles escolares */}
            {activeLesson.id === 13 && (
              <div id="school-supplies-showcase" className="p-4 bg-indigo-50/40 border border-indigo-100 rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <span className="p-1 bg-indigo-150 text-indigo-700 rounded-md">🎒</span>
                  <p className="text-xs font-extrabold text-indigo-800 uppercase tracking-wider">Visor de Mochila Escolar</p>
                </div>
                <p className="text-xs text-slate-500">Mueve o pasa el ratón por encima de los útiles escolares para aprender su artículo y pronunciación:</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { fr: "le livre", sp: "el libro", emoji: "📖" },
                    { fr: "le stylo", sp: "el bolígrafo", emoji: "🖊️" },
                    { fr: "la gomme", sp: "el borrador", emoji: "🧽" },
                    { fr: "la trousse", sp: "la cartuchera", emoji: "👝" },
                    { fr: "le sac à dos", sp: "la mochila", emoji: "🎒" }
                  ].map((item, idx) => (
                    <div id={`supply-item-${idx}`} key={idx} className="bg-white p-3 rounded-xl border border-slate-100 text-center flex flex-col justify-between items-center group hover:scale-[1.02] hover:border-indigo-300 transition-all shadow-xs">
                      <span className="text-2xl mb-1">{item.emoji}</span>
                      <p className="text-[11px] font-extrabold text-slate-800 font-mono leading-tight">{item.fr}</p>
                      <p className="text-[10px] text-slate-400 capitalize">{item.sp}</p>
                      
                      <div className="mt-2 pt-1 border-t border-slate-50 w-full flex justify-center">
                        <AudioButton text={item.fr} size="sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* L15 & L16: Fecha actual interactiva */}
            {(activeLesson.id === 14 || activeLesson.id === 15 || activeLesson.id === 16) && (
              <div id="date-sandbox" className="p-4 bg-purple-50/50 border border-purple-200 rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <span className="p-1 bg-purple-100 text-purple-700 rounded-md">📅</span>
                  <p className="text-xs font-extrabold text-purple-800 uppercase tracking-wider">Calendario y Expresiones Temporales</p>
                </div>
                
                <div className="bg-white p-3 rounded-xl border border-slate-100 space-y-2">
                  <p className="text-xs text-slate-500">Hoy según el sistema local:</p>
                  
                  <div className="flex items-center justify-between bg-purple-50 p-2.5 rounded-lg border border-purple-100">
                    <div>
                      <span className="text-[10px] text-purple-700 font-bold uppercase tracking-wider">Aujourd'hui (Hoy)</span>
                      <p className="text-sm font-extrabold text-slate-800 font-mono mt-0.5">Aujourd'hui c'est dimanche (Le 31 mai)</p>
                    </div>
                    <AudioButton text="Aujourd'hui c'est dimanche" />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-slate-400 font-semibold uppercase block">Hier (Ayer)</span>
                        <span className="text-xs font-bold text-slate-700 font-mono">Hier, c'était samedi</span>
                      </div>
                      <AudioButton text="Hier, c'était samedi" />
                    </div>

                    <div className="bg-indigo-50/40 p-2 rounded-lg border border-indigo-100 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-indigo-400 font-semibold uppercase block">Demain (Mañana)</span>
                        <span className="text-xs font-bold text-indigo-900 font-mono">Demain, c'est lundi</span>
                      </div>
                      <AudioButton text="Demain, c'est lundi" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Examples block */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                Ejemplos del mundo real
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeLesson.details.examples.map((example, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100/50 transition-all">
                    <div className="shrink-0 pt-0.5">
                      <span className="text-xs font-bold text-indigo-600 bg-white border border-indigo-100 rounded-full w-5 h-5 flex items-center justify-center shadow-xs">
                        {i + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 font-mono whitespace-normal">
                        {example.french}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {example.spanish}
                      </p>
                    </div>
                    <div className="shrink-0">
                      <AudioButton text={example.audioText} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Core Footer Checklist */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Smile className="w-5 h-5 text-indigo-500" />
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800">¿Estudiado?</p>
                <p className="text-[10px] text-slate-400">Marca esta lección como lista para evaluar en el Quiz</p>
              </div>
            </div>

            <button
              id={`lesson-complete-toggle-btn-${activeLesson.id}`}
              onClick={() => onToggleCompleteLesson(activeLesson.id)}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 ${
                completedLessons.includes(activeLesson.id)
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              {completedLessons.includes(activeLesson.id) ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-100 fill-emerald-800" />
                  Lección completada ✓
                </>
              ) : (
                <>
                  Marcar como estudiado
                </>
              )}
            </button>
          </div>

        </div>

        {/* Quick Review Hint Card */}
        <div id="quick-evaluation-hint" className="p-4 bg-indigo-900 text-indigo-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-sm font-bold flex items-center justify-center sm:justify-start gap-1">
              <span>🚀</span> ¿Listo para probar tus conocimientos?
            </p>
            <p className="text-xs text-indigo-200">
              Usa el Quiz Interactivo para responder preguntas de los 17 temas estudiados.
            </p>
          </div>
          
          <button
            id="jump-to-quiz-action-btn"
            onClick={() => {
              // We'll instruct the shell / App wrapper tab-changer to go to the Quiz view
              const quizTab = document.getElementById('navbar-tab-quiz');
              if (quizTab) quizTab.click();
            }}
            className="px-4 py-2 bg-white text-indigo-900 rounded-xl text-xs font-extrabold hover:bg-indigo-50 transition-all flex items-center gap-1 shadow-sm"
          >
            Tomar Quiz <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>

    </div>
  );
}
