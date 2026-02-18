"use client";

import { useState, useMemo, useCallback } from "react";
import { questions, categories, type Question } from "@/data/questions";
import { useAuth } from "@/lib/auth";

type QuizState = "menu" | "quiz" | "result";

export default function Quiz() {
  const { user, signOut } = useAuth();
  const [state, setState] = useState<QuizState>("menu");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);

  const filteredQuestions = useMemo(() => {
    const filtered =
      selectedCategory === "all"
        ? [...questions]
        : questions.filter((q) => q.category === selectedCategory);
    // Shuffle
    for (let i = filtered.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
    }
    return filtered;
  }, [selectedCategory, state]); // re-shuffle on new quiz start

  const currentQuestion: Question | undefined = filteredQuestions[currentIndex];

  const handleStart = useCallback(
    (category: string) => {
      setSelectedCategory(category);
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setScore(0);
      setAnswers([]);
      setState("quiz");
    },
    []
  );

  const handleAnswer = useCallback(
    (index: number) => {
      if (selectedAnswer !== null) return;
      setSelectedAnswer(index);
      setShowExplanation(true);
      if (currentQuestion && index === currentQuestion.answer) {
        setScore((s) => s + 1);
      }
      setAnswers((a) => [...a, index]);
    },
    [selectedAnswer, currentQuestion]
  );

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= filteredQuestions.length) {
      setState("result");
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  }, [currentIndex, filteredQuestions.length]);

  if (state === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-2xl">📖</span> 宅建合格道
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 hidden sm:inline">
                {user?.email}
              </span>
              <button
                onClick={signOut}
                className="text-sm px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
              >
                ログアウト
              </button>
            </div>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              カテゴリを選択
            </h2>
            <p className="text-gray-500">
              全{questions.length}問から出題されます
            </p>
          </div>
          <div className="grid gap-4">
            <button
              onClick={() => handleStart("all")}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition text-left border-2 border-transparent hover:border-indigo-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-gray-800">
                    全カテゴリ
                  </div>
                  <div className="text-sm text-gray-500">
                    {questions.length}問
                  </div>
                </div>
                <div className="text-3xl">📚</div>
              </div>
            </button>
            {categories.map((cat) => {
              const count = questions.filter(
                (q) => q.category === cat
              ).length;
              const icons: Record<string, string> = {
                権利関係: "⚖️",
                宅建業法: "🏢",
                "法令上の制限": "📋",
                "税・その他": "💰",
              };
              return (
                <button
                  key={cat}
                  onClick={() => handleStart(cat)}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition text-left border-2 border-transparent hover:border-indigo-300"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-gray-800">
                        {cat}
                      </div>
                      <div className="text-sm text-gray-500">{count}問</div>
                    </div>
                    <div className="text-3xl">{icons[cat] || "📝"}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  if (state === "result") {
    const percentage = Math.round((score / filteredQuestions.length) * 100);
    const message =
      percentage >= 80
        ? "素晴らしい！合格レベルです！"
        : percentage >= 60
          ? "もう少しで合格ライン！"
          : "復習して再チャレンジしましょう！";

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">
            {percentage >= 80 ? "🎉" : percentage >= 60 ? "💪" : "📖"}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">結果発表</h2>
          <p className="text-gray-500 mb-6">{message}</p>
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="text-5xl font-bold text-indigo-600 mb-2">
              {score}{" "}
              <span className="text-xl text-gray-400">
                / {filteredQuestions.length}
              </span>
            </div>
            <div className="text-lg text-gray-600">正解率 {percentage}%</div>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => handleStart(selectedCategory)}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium"
            >
              もう一度チャレンジ
            </button>
            <button
              onClick={() => setState("menu")}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium"
            >
              カテゴリ選択に戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz state
  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setState("menu")}
            className="text-sm px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
          >
            ← 戻る
          </button>
          <div className="text-sm text-gray-500">
            {currentIndex + 1} / {filteredQuestions.length}
          </div>
        </div>
        <div className="w-full bg-gray-200 h-1">
          <div
            className="bg-indigo-500 h-1 transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%`,
            }}
          />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="mb-3">
          <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
            {currentQuestion.category}
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <p className="text-lg font-medium text-gray-800 leading-relaxed">
            {currentQuestion.question}
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {currentQuestion.choices.map((choice, index) => {
            let className =
              "w-full text-left p-4 rounded-xl border-2 transition font-medium ";

            if (selectedAnswer === null) {
              className +=
                "bg-white border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700";
            } else if (index === currentQuestion.answer) {
              className += "bg-green-50 border-green-500 text-green-800";
            } else if (index === selectedAnswer) {
              className += "bg-red-50 border-red-500 text-red-800";
            } else {
              className += "bg-gray-50 border-gray-200 text-gray-400";
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
                className={className}
              >
                <span className="inline-flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  {choice}
                </span>
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-6">
            <div className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
              <span>💡</span> 解説
            </div>
            <p className="text-yellow-900 leading-relaxed">
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        {selectedAnswer !== null && (
          <button
            onClick={handleNext}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-bold text-lg"
          >
            {currentIndex + 1 >= filteredQuestions.length
              ? "結果を見る"
              : "次の問題へ"}
          </button>
        )}
      </main>
    </div>
  );
}
