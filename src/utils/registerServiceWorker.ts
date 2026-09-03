// Service Worker Registration for Aviator PWA

export function registerServiceWorker() {
  if (process.env.NODE_ENV === "production" || window.location.hostname !== "localhost") {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("Aviator PWA ServiceWorker registered with scope:", registration.scope);
          })
          .catch((error) => {
            console.warn("Aviator PWA ServiceWorker registration failed:", error);
          });
      });
    }
  } else if ("serviceWorker" in navigator) {
    // Also register in dev preview so it can be tested
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Aviator PWA ServiceWorker (dev) registered:", registration.scope);
        })
        .catch((err) => {
          console.warn("Aviator PWA ServiceWorker registration notice:", err);
        });
    });
  }
}

export function unregisterServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
