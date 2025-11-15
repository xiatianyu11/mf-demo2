// 加载 remoteEntry.js
export function loadRemoteEntry(url, scope) {
  return new Promise((resolve, reject) => {
    if (window[scope]) {
      // 已加载过，直接 resolve
      return resolve(window[scope]);
    }

    const script = document.createElement("script");
    script.src = url;
    script.type = "text/javascript";
    script.async = true;

    script.onload = () => {
      const container = window[scope];
      if (!container) {
        reject(`Remote container ${scope} not found!`);
        return;
      }

      resolve(container);
    };

    script.onerror = () => reject(new Error(`Failed to load ${url}`));
    document.head.appendChild(script);
  });
}


// 加载 exposed module
export async function loadRemoteModule({ scope, module }) {
  // 初始化共享
  await __webpack_init_sharing__("default");

  const container = window[scope];
  await container.init(__webpack_share_scopes__.default);

  const factory = await container.get(module);
  const Module = factory();

  return Module;
}
