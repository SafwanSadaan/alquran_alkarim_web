'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "abd47f07f1b691a893dcbb1f780a4b83",
"assets/AssetManifest.bin.json": "e6cd194d0af6ee213830c41ebf69d474",
"assets/AssetManifest.json": "05b86a3484eb1a297e88a87133d334b6",
"assets/assets/basmalah.webp": "1d833180640f4af6a71abc5e133b03b0",
"assets/assets/compass.webp": "ccbfd0613831e579fb94071255286f8e",
"assets/assets/design.webp": "ed69657ee9ebbe5f5b26350b1eddab2d",
"assets/assets/email.webp": "867a9f09b1c2160767acf67f0bf773c8",
"assets/assets/facebook.webp": "5dcea0d83ed090332562e03ff09a0907",
"assets/assets/github.webp": "e76750b8bd06a7ed616ed1871b716f43",
"assets/assets/HafsSmart_08.ttf": "bd28a1b12834eee0203cf77b7eb03230",
"assets/assets/hafs_smart_v8.json": "e40e27fdcda9d245f6bae60a61ecd8ae",
"assets/assets/linkedin.webp": "abb1109852396a2ce18fd914580514f1",
"assets/assets/me_quran.ttf": "a79b204e9c3055c77f0d81921bd881c2",
"assets/assets/PlayfairDisplay_Regular.ttf": "a96ecd13655587d30a21265c547cd8aa",
"assets/assets/qaaba.webp": "48ceb2a55b4c7e1a83422eff4d60146a",
"assets/assets/quran_logo.webp": "c51dc6de327015edbcda8c02a1a6d020",
"assets/assets/safwan1.webp": "598a9287e03c377bde1e4d00e2f642f9",
"assets/assets/telegram.webp": "342e0c83aff6dc999cc477a1748e4ce7",
"assets/assets/web2.webp": "ed96722facdb4714db19ae6edd8aa2ef",
"assets/assets/whatsApp.webp": "24f0ab6a7f10c656522166d2144522d9",
"assets/FontManifest.json": "1489919a83f9f50edf2a4e8fd7026eb3",
"assets/fonts/MaterialIcons-Regular.otf": "2ee894cfdf0c5cb00c02f50996977e95",
"assets/NOTICES": "0ec003caf0a2c15151da98403534c6c7",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "e986ebe42ef785b27164c36a9abc7818",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "66177750aff65a66cb07bb44b8c6422b",
"canvaskit/canvaskit.js.symbols": "48c83a2ce573d9692e8d970e288d75f7",
"canvaskit/canvaskit.wasm": "1f237a213d7370cf95f443d896176460",
"canvaskit/chromium/canvaskit.js": "671c6b4f8fcc199dcc551c7bb125f239",
"canvaskit/chromium/canvaskit.js.symbols": "a012ed99ccba193cf96bb2643003f6fc",
"canvaskit/chromium/canvaskit.wasm": "b1ac05b29c127d86df4bcfbf50dd902a",
"canvaskit/skwasm.js": "694fda5704053957c2594de355805228",
"canvaskit/skwasm.js.symbols": "262f4827a1317abb59d71d6c587a93e2",
"canvaskit/skwasm.wasm": "9f0c0c02b82a910d12ce0543ec130e60",
"canvaskit/skwasm.worker.js": "89990e8c92bcb123999aa81f7e203b1c",
"favicon.png": "d9c031687862c2e715f9ca214e66bd96",
"flutter.js": "f393d3c16b631f36852323de8e583132",
"flutter_bootstrap.js": "0e5de9db9d2bce7fc2f9f8c248de2397",
"icons/Icon-192.png": "3a73d63f5c8daac5de042ae0420a31d3",
"icons/Icon-512.png": "9f44afe213cf7e9363a979b0edfdf8f1",
"icons/Icon-maskable-192.png": "3a73d63f5c8daac5de042ae0420a31d3",
"icons/Icon-maskable-512.png": "9f44afe213cf7e9363a979b0edfdf8f1",
"index.html": "1c7486932e71ddd83e1cbfd7f85ea63d",
"/": "1c7486932e71ddd83e1cbfd7f85ea63d",
"main.dart.js": "acdd43f6655e5512365ecf312c7f7f85",
"manifest.json": "f5ad2396398ac1f2599195185b945613",
"version.json": "3cc5a414d6623fc45e1e0ad3afc17362"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
