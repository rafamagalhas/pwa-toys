"use strict";

const CACHE_NAME = "static-toy-app";
const CACHE_FILES = [
  "css/bootstrap.min.css",
  "css/styles.css",
  "icons/favicon.ico",
  "icons/152.png",
  "images/logo.png",
  "images/bg001.jpg",
  "images/bg002.jpg",
  "images/cat_icon.jpg",
  "images/offline.png",
  "js/app.js",
  "js/bootstrap.bundle.min.js",
  "offline.html",
];

self.addEventListener("install", (evt) => {
  console.info("Service Worker on installing");

  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.info("Service Worker static cache added");
      return cache.addAll(CACHE_FILES);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (evt) => {
  console.info("Service Worker on activing");

  evt.waitUntil(
    caches.keys().then((keylist) => {
      return Promise.all(
        keylist.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (evt) => {
  if (evt.request.mode !== "navigate") {
    return;
  }

  evt.respondWith(
    fetch(evt.request).catch(async () => {
      const cache = await caches.open(CACHE_NAME);
      return await cache.match("offline.html");
    })
  );
});
