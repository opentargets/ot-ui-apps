export function createViewModel() {
  const listeners = new Set();

  const view = {
    viewStart: 20,
    viewEnd: 50,

    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },

    setView(domainStart, domainEnd) {
      view.viewStart = domainStart;
      view.viewEnd = domainEnd;
      listeners.forEach(fn => fn(view));
    },

    domainToNorm(x) {
      return (x - view.viewStart) / (view.viewEnd - view.viewStart);
    },

    normToDomain(t) {
      return view.viewStart + t * (view.viewEnd - view.viewStart);
    }
  };

  return view;
}