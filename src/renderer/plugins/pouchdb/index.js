import Vue from "vue"

/* PouchDB */
let PouchDB = require("pouchdb-core")
  .plugin(require("pouchdb-adapter-idb"))
  .plugin(require("pouchdb-adapter-http"))
  .plugin(require("pouchdb-mapreduce"))
  .plugin(require("pouchdb-replication"))
  .plugin(require("pouchdb-find"))

// 개발용
// pouchdb-server or couchdb
// Vue.prototype.$test = new PouchDB("http://localhost:5984/sample")

// 로컬
Vue.prototype.$test = new PouchDB("metubev145")

// 서비스
// App.vue -> onNewReleaseCheck()
Vue.prototype.$db = new PouchDB("http://202.182.100.137/metube")
