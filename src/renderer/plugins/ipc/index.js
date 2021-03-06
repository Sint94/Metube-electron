import Vue from "vue"
import { ipcRenderer } from "electron"

Vue.ipcRenderer = Vue.prototype.$ipcRenderer = ipcRenderer
Vue.event = Vue.prototype.$eventBus = new Vue()

Vue.ipcRenderer.on("player2Win", (e, data) => {
  let event_key = data[0]
  let event_value = data[1]
  if (event_key == "onReady") {
  } else if (event_key == "onStateChange") {
    Vue.event.$emit("playerState", event_value)
  } else if (event_key == "currentTime") {
    Vue.event.$emit("playerSecond", event_value)
  }
})

if (process.env.NODE_ENV !== "development") {
  setInterval(() => {
    Vue.ipcRenderer.send("event:appStart", {})
  }, 30000)
}
