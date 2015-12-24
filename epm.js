module.exports = function installPostMessage (options) {
  options = options || {}
  options.channelName = options.channelName || '__postMessage'

  // outside of webview
  if (options.webview) {
    var proxyIframe = document.createElement('iframe')
    document.body.appendChild(proxyIframe)

    proxyIframe.contentWindow.postMessage = function (msgStr) {
      options.webview.send(options.channelName, msgStr)
    }
    options.webview.addEventListener('ipc-message', function (event) {
      if (event.channel === options.channelName) {
        var msgStr = event.args[0].data
        dispatch(msgStr, proxyIframe.contentWindow)
      }
    })

    return proxyIframe
  }

  // inside of webview
  window.parent.postMessage = function (msgStr) {
    ipc.sendToHost(options.channelName, {
      data: msgStr
    })
  }
  ipc.on(options.channelName, function (msgStr) {
    dispatch(msgStr, window.parent)
  })
}

function dispatch (msgStr, source) {
  var message = new MessageEvent('message', {
    view: window.parent,
    bubbles: false,
    cancelable: false,
    data: msgStr,
    source: source
  })
  window.dispatchEvent(message)
}
