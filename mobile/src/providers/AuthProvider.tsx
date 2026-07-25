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


// import { PropsWithChildren, useEffect } from "react";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "@/config/firebase";
// import { useAuthStore } from "@/stores/auth.store";
// import { getSecureItem } from "@/components/SecureStore";
// import { router } from "expo-router";

// export function AuthProvider({ children }: PropsWithChildren) {
//   const setUser = useAuthStore((state) => state.setUser);
//   const setIsLoading = useAuthStore((state) => state.setIsLoading);
//   const setError = useAuthStore((state) => state.setError);
//   const refreshUser = useAuthStore((state) => state.refreshUser);

//   useEffect(() => {
//     setIsLoading(true);

    // const unsubscribe = onAuthStateChanged(
    //   auth,
    //   async (firebaseUser) => {
    //     try {
    //       if (firebaseUser) {
    //         await refreshUser();
    //         const { user } = useAuthStore.getState();
    //         // console.log(user, "user in provider")
    //         if (!user?.profile.registrationComplete) {
    //           const step = await getSecureItem("onboardingStep");
              
    //           switch (step) {
    //             case "1":
    //               router.replace("/onboarding-first");
    //               break;

    //             case "2":
    //               router.replace("/onboarding-second");
    //               break;

    //             case "3":
    //               router.replace("/onboarding-third");
    //               break;

    //             default:
    //               router.replace("/onboarding-first");
    //           }
    //         } else {
    //           router.replace("/home");
    //         }
    //       } else {
    //         setUser(null);
    //         setError(null);
    //         setIsLoading(false);
    //       }
    //     } catch (error) {
    //       setUser(null);
    //       setError(error as Error);
    //       setIsLoading(false);
    //     }
    //   },
    //   (error) => {
    //     setUser(null);
    //     setError(error);
    //     setIsLoading(false);
    //   }
    // );
//     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//       if (firebaseUser) {
//         console.log("User exists");

//         router.replace("/login");
//       } else {
//         router.replace("/login");
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   return <>{children}</>;
// }