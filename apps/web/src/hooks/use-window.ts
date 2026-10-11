function useWindow(): { scrollToTop: () => void } {
  function scrollToTop(): void {
    window.scrollTo(0, 0);
  }

  return { scrollToTop };
}

export default useWindow;
