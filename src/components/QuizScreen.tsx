import React, { useState, useEffect, useRef, useCallback } from 'react';
import { QuizQuestion, PlayerAnswer, GameStats } from '../types';
import { TachometerTimer } from './TachometerTimer';
import { TelemetryBar } from './TelemetryBar';
import { QuestionCard } from './QuestionCard';
import { TelemetryInsight } from './TelemetryInsight';
import { calculatePoints, computeGameStats } from '../utils/formatters';
import { sound } from '../utils/sound';

interface QuizScreenProps {
  questions: QuizQuestion[];
  onFinishGame: (stats: GameStats, answers: PlayerAnswer[]) => void;
  onQuitGame: () => void;
}

const QUESTION_TIME_LIMIT = 15; // 15 seconds per lap

export const QuizScreen: React.FC<QuizScreenProps> = ({
  questions,
  onFinishGame,
  onQuitGame
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(QUESTION_TIME_LIMIT);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [pointsEarnedForCurrent, setPointsEarnedForCurrent] = useState<number>(0);
  const [answersLog, setAnswersLog] = useState<PlayerAnswer[]>([]);

  const currentQuestion = questions[currentIndex];
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Handle timeout (when 15s runs out)
  const handleTimeout = useCallback(() => {
    if (isAnswerChecked) return;

    sound.playWrong();
    setIsAnswerChecked(true);
    setSelectedOption(-1); // -1 signifies timeout
    setStreak(0);
    setPointsEarnedForCurrent(0);

    const answerRecord: PlayerAnswer = {
      questionIndex: currentIndex,
      question: currentQuestion,
      selectedIndex: -1,
      isCorrect: false,
      timeRemaining: 0,
      timeTaken: QUESTION_TIME_LIMIT,
      pointsEarned: 0
    };

    setAnswersLog(prev => [...prev, answerRecord]);
  }, [currentIndex, currentQuestion, isAnswerChecked]);

  // Main 15s timer effect
  useEffect(() => {
    if (isAnswerChecked) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    startTimeRef.current = Date.now();
    setTimeRemaining(QUESTION_TIME_LIMIT);

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        const next = Math.max(0, prev - 0.1);

        // Sound warning at whole second intervals when <= 4s
        if (Math.ceil(next) <= 4 && Math.abs(next - Math.round(next)) < 0.06) {
          sound.playTickWarning();
        }

        if (next <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return next;
      });
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isAnswerChecked, handleTimeout]);

  // Option selection
  const handleSelectOption = (index: number) => {
    if (isAnswerChecked) return;
    if (timerRef.current) clearInterval(timerRef.current);

    const isCorrect = index === currentQuestion.correctIndex;
    const timeTaken = parseFloat(((Date.now() - startTimeRef.current) / 1000).toFixed(1));
    let earned = 0;
    let nextStreak = streak;

    if (isCorrect) {
      sound.playCorrect();
      nextStreak = streak + 1;
      setStreak(nextStreak);
      setMaxStreak(prev => Math.max(prev, nextStreak));
      earned = calculatePoints(timeRemaining, nextStreak);
      setScore(prev => prev + earned);
    } else {
      sound.playWrong();
      setStreak(0);
    }

    setSelectedOption(index);
    setIsAnswerChecked(true);
    setPointsEarnedForCurrent(earned);

    const answerRecord: PlayerAnswer = {
      questionIndex: currentIndex,
      question: currentQuestion,
      selectedIndex: index,
      isCorrect,
      timeRemaining,
      timeTaken,
      pointsEarned: earned
    };

    setAnswersLog(prev => [...prev, answerRecord]);
  };

  // Move to next question or conclude race
  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      sound.playClick();
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
      setPointsEarnedForCurrent(0);
    } else {
      // Game completed!
      const finalStats = computeGameStats(answersLog, score, maxStreak);
      onFinishGame(finalStats, answersLog);
    }
  };

  const isLastQuestion = currentIndex + 1 >= questions.length;
  const isCorrect = selectedOption !== null && selectedOption === currentQuestion.correctIndex;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-4">
      {/* Telemetry Header with Lap and Sector Flags */}
      <TelemetryBar
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        score={score}
        streak={streak}
        answersLog={answersLog}
      />

      {/* RPM Tachometer Timer */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1">
          <TachometerTimer
            timeRemaining={timeRemaining}
            totalTime={QUESTION_TIME_LIMIT}
          />
        </div>

        {/* Abort / Box Button */}
        <button
          onClick={onQuitGame}
          className="px-3 py-2.5 rounded-xl bg-[#151922] hover:bg-[#1e2330] text-slate-400 hover:text-slate-200 border border-[#232936] text-xs font-racing transition cursor-pointer self-stretch flex items-center justify-center shrink-0"
          title="Ritiro ai box (Torna al menu)"
        >
          BOX / ESCI
        </button>
      </div>

      {/* Main Question Card */}
      <QuestionCard
        question={currentQuestion}
        selectedOption={selectedOption}
        isAnswerChecked={isAnswerChecked}
        onSelectOption={handleSelectOption}
      />

      {/* Immediate Telemetry Insight / Feedback */}
      {isAnswerChecked && (
        <TelemetryInsight
          question={currentQuestion}
          isCorrect={isCorrect}
          pointsEarned={pointsEarnedForCurrent}
          onNext={handleNextQuestion}
          isLastQuestion={isLastQuestion}
        />
      )}
    </div>
  );
};
