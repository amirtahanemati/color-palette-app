const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // Window controls
  minimizeWindow: () => ipcRenderer.send("window-minimize"),
  maximizeWindow: () => ipcRenderer.send("window-maximize"),
  closeWindow: () => ipcRenderer.send("window-close"),
  isMaximized: () => ipcRenderer.invoke("window-is-maximized"),

  // Backend URL - فرانت از اینجا آدرس API رو می‌گیره
  getBackendUrl: () => ipcRenderer.invoke("get-backend-url"),

  // باز کردن لینک در مرورگر دیفالت سیستم
  openExternal: (url) => ipcRenderer.send("open-external", url),
});
