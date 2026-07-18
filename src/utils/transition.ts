export const transitionPageOut = (href: string, router: any) => {
  // Dispatch a custom event that TransitionOverlay listens to
  const event = new CustomEvent("page-transition-out", {
    detail: { href, router },
  });
  window.dispatchEvent(event);
};
