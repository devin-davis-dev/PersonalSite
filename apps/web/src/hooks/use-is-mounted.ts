import { useEffect, useState } from "react";

/**
 * Hook to detect whether the component is mounted on the client.
 * Returns false during SSR and initial hydration, and true after mounting.
 */
export function useIsMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

export default useIsMounted;
