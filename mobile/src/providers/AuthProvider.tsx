import { PropsWithChildren, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useAuthStore } from "@/stores/auth.store";

export function AuthProvider({
  children,
}: PropsWithChildren) {
  const setUser = useAuthStore((state) => state.setUser);
  const setIsLoading = useAuthStore(
    (state) => state.setIsLoading
  );
  const setError = useAuthStore((state) => state.setError);
  const refreshUser = useAuthStore(
    (state) => state.refreshUser
  );

  useEffect(() => {
    setIsLoading(true);

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        try {
          if (!firebaseUser) {
            setUser(null);
            setError(null);
            return;
          }

          await refreshUser(firebaseUser);
        } catch (error) {
          setUser(null);
          setError(
            error instanceof Error
              ? error
              : new Error("Authentication failed")
          );
          
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        setUser(null);
        setError(error);
        setIsLoading(false);
      }
    );

    return unsubscribe;
  }, [
    refreshUser,
    setError,
    setIsLoading,
    setUser,
  ]);

  return <>{children}</>;
}