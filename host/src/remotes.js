const isProd = process.env.NODE_ENV === "production";

export const remotes = {
  remoteApp: isProd
    ? "remoteApp@https://cdn.yourdomain.com/remote/remoteEntry.js"
    : "remoteApp@http://localhost:3001/remoteEntry.js"
};
