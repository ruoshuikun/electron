const { app, BrowserWindow, ipcMain } = require('electron')

// 主进程
const createWindow = () => {
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

}

// 主进程与渲染进程通信, 主进程接收渲染进程发送的消息
ipcMain.on('my-channel', (event, args) => {
  console.log('🚀 ~ event', event) // 在命令行处打印
  console.log('🚀 ~ args', args) // 在命令行处打印
  // 主进程往渲染进程发送消息 
  event.reply('child-channel', {
    event: 'msg',
    data: 'hello child!'
  })
})

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