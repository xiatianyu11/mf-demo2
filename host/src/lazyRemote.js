import React from "react";
import { loadRemoteEntry, loadRemoteModule } from "./loadRemote";

export function lazyRemoteRoute(url, scope, module) {
  return React.lazy(async () => {
    // 1. remoteEntry.js 延迟加载
    await loadRemoteEntry(url, scope);

    // 2. module 延迟加载
    const mod = await loadRemoteModule({ scope, module });

    return { default: mod.default };
  });
}
