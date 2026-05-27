// src/features/auth/api/auth.key.ts
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
  me: () => [...authKeys.all, 'me'] as const,
  // Add more keys as needed for queries
};
