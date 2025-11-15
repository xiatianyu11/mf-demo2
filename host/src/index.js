import("./bootstrap");


// src/loadRemote.js
export function loadRemoteScript(url, scope) {
  return new Promise((resolve, reject) => {
    if (window[scope]) return resolve(window[scope]);

    const script = document.createElement("script");
    script.src = url;
    script.onload = () => {
      console.log(`${scope} loaded from ${url}`);
      resolve(window[scope]);
    };
    script.onerror = () => reject(new Error(`Failed to load ${url}`));
    document.head.appendChild(script);
  });
}

// 将全局函数挂到 window，给 webpack promise remote 调用
window.loadRemote1 = () =>
  fetch("/remote-config.json") // 从服务端获取远程 URL
    .then(res => res.json())
    .then(config => loadRemoteScript(config.remote1, "remote1"));

window.loadRemote2 = () =>
  fetch("/remote-config.json")
    .then(res => res.json())
    .then(config => loadRemoteScript(config.remote2, "remote2"));

