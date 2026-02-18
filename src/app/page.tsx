"use client";

import { AuthProvider, useAuth } from "@/lib/auth";
import LoginScreen from "@/components/LoginScreen";
import Quiz from "@/components/Quiz";

function AppContent() {
  const { user, loading, isAllowed } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-lg text-gray-600">読み込み中...</div>
      </div>
    );
  }

  if (!user || !isAllowed) {
    return <LoginScreen />;
  }

  return <Quiz />;
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
