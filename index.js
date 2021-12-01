const { app, BrowserWindow, ipcMain, MessageChannelMain } = require('electron')

// 主进程
// async 要保证 worker 子进程 要优先于 win 主进程加载
const createWindow = async () => {
  // 创建浏览器窗口
  const worker = new BrowserWindow({
    show: false,
    // width: 1200,
    // height: 600,
    webPreferences: {
      nodeIntegration: true,
      // 最新版本Electron v15 必须添加 
      contextIsolation: false
    }
  })

  await worker.loadFile('child.html')

  // 创建浏览器窗口
  const win = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      // 最新版本Electron v15 必须添加 
      contextIsolation: false
    }
  })

  win.loadFile('index.html')

  // 打开调试
  win.webContents.openDevTools()


  // 主进程与渲染进程通信
  ipcMain.on('my-channel', (event, args) => {
    if (event.senderFrame === win.webContents.mainFrame) {
      // Create a new channel ... 建立通道1、通道2
      const { port1, port2 } = new MessageChannelMain()
      // ... send one end to the worker ...
      worker.webContents.postMessage('new-work', null, [port1])
      // ... and the other end to the main window.
      event.senderFrame.postMessage('child-channel', null, [port2])
      // Now the main window and the worker can communicate with each other
      // without going through the main process!
    }
  })
}

// 例子将会展示如何在最后一个窗口被关闭时退出应用
app.on('window-all-closed', () => {
  // console.log('window-all-closed')
  // TODO 对于macOS系统 -> 关闭窗口时，不会直接退出应用
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 当应用程序完成基础的启动的时候被触发
app.on('will-finish-launching', () => {
  // console.log('will-finish-launching')
})

// 当 Electron 完成初始化时，触发一次
app.on('ready', () => {
  // console.log('ready')
})

// 当所有窗口被关闭后触发，同时应用程序将退出。
app.on('will-quit', () => {
  // console.log('will-quit')
})

// 在程序关闭窗口前触发。 
app.on('before-quit', () => {
  // console.log('before-quit')
})

// 在应用程序退出时触发 
app.on('quit', () => {
  // console.log('quit')
})

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    // 如果所有的窗口长度是0,就说明现在是没有窗口时激活的。就调用 createWindow()
    if (BrowserWindow.getAllWindows.length === 0) {
      createWindow()
    }
  })
})

