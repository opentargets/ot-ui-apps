export function createViewModel() {
  const listeners = new Set();

  const view = { 
    start: null,
    end: null,

    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },

    setView(domainStart, domainEnd) {
      view.start = domainStart;
      view.end = domainEnd;
      listeners.forEach(fn => fn(view));
    },

    domainToNorm(x) {
      return (x - view.start) / (view.end - view.start);
    },

    normToDomain(t) {
      return view.start + t * (view.end - view.start);
    }
  };

  return view;
}