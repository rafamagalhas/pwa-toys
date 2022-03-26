let swRegistration = null;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").then((reg) => {
      console.info("Service Worker was successfully registered!");
      swRegistration = reg;
    });
    installStart();
  });
}

let installTrigger;

let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  installTrigger = e;
  showInstallPromotion();
});

const installButton = document.getElementById("install-button");

function installStart() {
  installButton.removeAttribute("hidden");
  installButton.addEventListener("click", function () {
    installTrigger.prompt();

    installTrigger.userChoice.then((choice) => {
      if (choice.outcome === "accepted") {
        console.info("User made a installation");
      } else {
        console.info("User don't made a installation");
      }
    });
  });
}
