# electronic-post-message

A postMessage polyfill for electron webview. Useful if you want to reuse existing postMessage libraries to talk with code inside an electron webview (e.g. [secret-door](https://github.com/QubitProducts/secret-door)).

## Usage

Inside of webview

```js
import installPostMessage from 'electronic-post-message'

installPostMessage()



// That's it!! Use postMessage as usual
window.parent.postMessage('ping')
window.addEventListener('message', function (msg) {
  if (msg.source === window.parent) {
    console.log(msg.data) // logs 'pong'
  }
})
```

In electron top level window

```js
import installPostMessage from 'electronic-post-message'

var proxyIframe = installPostMessage({
  webview: document.getElementById('#some-webview')
})



// That's it!! Use postMessage as usual with proxyIframe.contentWindow as target
window.addEventListener('message', function (msg) {
  if (msg.source === proxyIframe.contentWindow) {
    console.log(msg.data) // logs 'ping'
    proxyIframe.contentWindow.postMessage('pong')
  }
})
```

### FAQ

* Why is `proxyIframe` needed? Because an electron `webview` is not a Window or MessagePort. Which means we can't create an instance of `MessageEvent` with source set to `webview` since the browser throws a `The optional 'source' property is neither a Window nor MessagePort.` exception.
