import { createContext, useContext, useState, ReactNode } from 'react';

type QuizData = {
  gender?: string;
  weight?: number;
  pr?: { bench?: number; squat?: number; deadlift?: number };
};

type QuizContextType = {
    quiz: QuizData;
    setQuiz: (q: QuizData) => void;
};

type Props = {
  children: ReactNode;
};

const QuizContext = createContext<QuizContextType>({ 
    quiz: {}, setQuiz: () => {} });

export const QuizProvider = ( { children }: Props ) => {
  const [quiz, setQuiz] = useState<QuizData>({});
  return (
    <QuizContext.Provider value={{ quiz, setQuiz }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => useContext(QuizContext);