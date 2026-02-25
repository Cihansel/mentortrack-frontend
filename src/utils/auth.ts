// src/utils/auth.ts

export type UserRole = "ADMIN" | "STUDENT" | "PARENT";

export type AuthData = {
  token: string;
  role: UserRole;
  email: string;
};

const STORAGE_KEY = "mentortrack_auth";

/** localStorage'dan login bilgisini okur */
export function getAuth(): AuthData | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (parsed.token && parsed.role) {
      return parsed as AuthData;
    }
    return null;
  } catch {
    return null;
  }
}

/** Çıkış yapmak için kullanırsın (ileride lazım olacak) */
export function clearAuth() {
  localStorage.removeItem(STORAGE_KEY);
}
