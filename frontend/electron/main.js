const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const http = require("http");
const net = require("net");

const isDev = !app.isPackaged;

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

let mainWindow;
let backendProcess = null;
let backendPort = null;

function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
  });
}

function getBackendPath() {
  if (isDev) {
    return {
      cmd: "python",
      args: [path.join(__dirname, "../../backend/main_runner.py")],
    };
  }
  const exeName = process.platform === "win32" ? "backend.exe" : "backend";
  const backendPath = path.join(process.resourcesPath, "backend", exeName);
  return { cmd: backendPath, args: [] };
}

function startBackend(port) {
  return new Promise((resolve, reject) => {
    const { cmd, args } = getBackendPath();

    // پورت رو به عنوان argument پاس میدیم
    const allArgs = [...args, "--port", String(port)];

    console.log(`[Backend] Starting: ${cmd} ${allArgs.join(" ")}`);

    backendProcess = spawn(cmd, allArgs, {
      windowsHide: true,
    });

    backendProcess.stdout.on("data", (data) => {
      const text = data.toString().trim();
      console.log(`[Backend] ${text}`);
      if (
        text.includes("Application startup complete") ||
        text.includes("Uvicorn running")
      ) {
        resolve();
      }
    });

    backendProcess.stderr.on("data", (data) => {
      const text = data.toString().trim();
      console.error(`[Backend ERR] ${text}`);
      if (
        text.includes("Application startup complete") ||
        text.includes("Uvicorn running")
      ) {
        resolve();
      }
    });

    backendProcess.on("error", (err) => {
      console.error("[Backend] Failed to start:", err);
      reject(err);
    });

    backendProcess.on("exit", (code) => {
      console.log(`[Backend] Exited with code ${code}`);
    });

    // fallback timeout
    setTimeout(() => resolve(), 20000);
  });
}

function stopBackend() {
  if (backendProcess) {
    if (process.platform === "win32") {
      spawn("taskkill", ["/pid", backendProcess.pid, "/f", "/t"]);
    } else {
      backendProcess.kill("SIGTERM");
    }
    backendProcess = null;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 720,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    backgroundColor: "#F8F6F1",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, "assets/icon.png"),
    show: false,
  });

  const url = isDev
    ? "http://localhost:5173"
    : `file://${path.join(__dirname, "../dist/index.html")}`;

  mainWindow.loadURL(url);
  mainWindow.once("ready-to-show", () => mainWindow.show());
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

ipcMain.on("window-minimize", () => mainWindow?.minimize());
ipcMain.on("window-maximize", () => {
  if (mainWindow?.isMaximized()) mainWindow.unmaximize();
  else mainWindow?.maximize();
});
ipcMain.on("window-close", () => mainWindow?.close());
ipcMain.handle("window-is-maximized", () => mainWindow?.isMaximized() ?? false);
ipcMain.handle("get-backend-url", () => `http://127.0.0.1:${backendPort}`);
ipcMain.on("open-external", (_, url) => shell.openExternal(url));

app.whenReady().then(async () => {
  try {
    backendPort = await findFreePort();
    await startBackend(backendPort);
    console.log(`[App] Backend running on port ${backendPort}`);
  } catch (err) {
    console.error("Could not start backend:", err);
  }
  createWindow();
});

app.on("window-all-closed", () => {
  stopBackend();
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("before-quit", () => stopBackend());
