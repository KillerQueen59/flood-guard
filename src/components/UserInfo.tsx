"use client";

import { useAuth } from "@/contexts/AuthContext";

export function UserInfo() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-sm text-gray-600">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return <div className="text-sm text-gray-600">Welcome, {user.email}</div>;
}
