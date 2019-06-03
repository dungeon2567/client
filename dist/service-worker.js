importScripts("/precache-manifest.93ca8531be5844baf32bd1e153d79a85.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

workbox.precaching.cleanupOutdatedCaches();

workbox.core.setCacheNameDetails({
  prefix: "appCache"
});

workbox.core.clientsClaim();

workbox.core.skipWaiting();

workbox.precaching.precacheAndRoute(
  [
    "https://use.fontawesome.com/releases/v5.8.2/css/all.css",
    "https://fonts.googleapis.com/css?family=Roboto:400,700"
  ].concat(self.__precacheManifest)
);


workbox.routing.registerNavigationRoute(
  workbox.precaching.getCacheKeyForURL("/index.html"), {
    blacklist: [
      new RegExp('/api/.*'),
    ]
  }
);
