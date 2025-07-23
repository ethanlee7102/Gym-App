import { createContext, useContext, useState, ReactNode } from 'react';

type PersonalRecords = {
  squat: number;
  bench: number;
  deadlift: number;
};

type QuizData = {
  gender: 'male' | 'female' | 'other';
  weight: number;
  personalRecords: PersonalRecords;
};

type QuizContextType = {
    quiz: QuizData;
    setQuiz: (q: QuizData) => void;
};

type Props = {
  children: ReactNode;
};

const defaultQuiz: QuizData = {
  gender: 'other',
  weight: 0,
  personalRecords: {
    squat: 0,
    bench: 0,
    deadlift: 0,
  },
};

const QuizContext = createContext<QuizContextType>({
  quiz: defaultQuiz,
  setQuiz: () => {},
});

export const QuizProvider = ( { children }: Props ) => {
  const [quiz, setQuiz] = useState<QuizData>(defaultQuiz);
  return (
    <QuizContext.Provider value={{ quiz, setQuiz }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => useContext(QuizContext);