/*---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *--------------------------------------------------------------------------------------------*/

'use strict';

<template>
  <div>
    <img
      class="like"
      v-if="isToggle"
      src="@/assets/images/svg/bookmark-on.svg"
      title="Remove Collection"
    >
    <img
      class="like"
      v-if="!isToggle"
      src="@/assets/images/svg/bookmark-off.svg"
      title="Add Collection"
    >
  </div>
</template>

<script>
import * as $commons from "@/service/commons-service.js";
import StoreMixin from "@/components/Mixin/index";
import DataUtils from "@/components/Mixin/db";

export default {
  name: "CollectionRegister",
  mixins: [StoreMixin, DataUtils],
  props: {
    isLikeToggle: {
      type: Boolean,
      default: false
    },
    data: null,
    playType: null
  },
  data() {
    return {
      isToggle: false,
      id: null
    };
  },
  watch: {
    data(val) {
      this.data = val;
    },
    isLikeToggle(val) {
      this.isToggle = val;
    }
  },
  methods: {
    like() {
      const user = this.getUserId();
      if (user) {
        if (this.isToggle) {
          if (this.data) {
            const options = {
              selector: {
                type: {
                  $eq: this.playType === "play" ? "myplaylist" : "mychannel"
                },
                userId: {
                  $eq: user
                },
                playlistId: {
                  $eq:
                    this.playType === "play"
                      ? this.data.playlistId.split(":")[1]
                      : this.data.channelPlaylistId
                }
              }
            };
            this.createIndex(["type", "userId", "playlistId"]).then(() => {
              return this.$test.find(options).then(result => {
                const doc = result.docs[0];
                if (doc) {
                  this.$test.remove(doc).then(res => {
                    if (res.ok) {
                      this.isToggle = false;
                      this.$emit("toggle", this.isToggle);
                      this.$emit("callback", true);
                    }
                  });
                }
              });
            });
          }
        } else {
          if (this.data) {
            const options = {
              selector: {
                type: {
                  $eq: this.playType === "play" ? "myplaylist" : "mychannel"
                },
                userId: {
                  $eq: user
                }
              }
            };
            this.createIndex(["type", "userId"]).then(() => {
              return this.$test.find(options).then(result => {
                const docs = result.docs;
                if (docs.length > 0) {
                  let findToItem = "";
                  if (this.playType === "play") {
                    findToItem = this.$lodash.find(docs, {
                      playlistId: this.data.playlistId
                    });
                  } else {
                    findToItem = this.$lodash.find(docs, {
                      channelId: this.data.list[0].channelId
                    });
                  }
                  if (findToItem) {
                    this.alreadyDialog(); // 이미 등록 된 컬렉션
                  } else {
                    this.addCollection(this.data); // 등록되지 않은 콜렉션이면 등록한다.
                  }
                } else {
                  this.addCollection(this.data);
                }
              });
            });
          }
        }
      } else {
        this.errorLogin();
      }
    },

    addCollection(item) {
      let data = {
        playType: this.playType,
        userId: this.getUserId(),
        playlistId: item.list[0].playlistId,
        channelId: item.list[0].channelId ? item.list[0].channelId : null,
        videoId: item.videoId ? item.videoId : null,
        title: item.playlistTitle,
        creates: this.$moment().format("YYYYMMDDHHmmss"),
        created: this.$moment().format("YYYY-MM-DD HH:mm:ss")
      };
      if (this.playType === "play") {
        // PLAY LIST
        data.type = "myplaylist";
        data.thumbnails = item.list[0].imageInfo;
        this.$test.post(data).then(result => {
          if (result.ok) {
            this.isToggle = true;
            this.$emit("toggle", true);
          }
        });
      } else {
        // CHANNEL
        let requestURL = $commons.youtubeChannelSearch(data.channelId);
        this.$http.get(requestURL).then(res => {
          data.thumbnails = res.data.items[0].snippet.thumbnails.medium.url;
          data.title = res.data.items[0].snippet.title;
          data.type = "mychannel";
          this.$test.post(data).then(result => {
            if (result.ok) {
              this.isToggle = true;
              this.$emit("toggle", true);
            }
          });
        });
      }
    },

    alreadyDialog() {
      this.$modal.show("dialog", {
        title: "Info",
        text: "Already registered playlist.",
        buttons: [
          {
            title: "Close"
          }
        ]
      });
    },

    errorLogin() {
      this.$modal.show("dialog", {
        title: "Infomation",
        text: "It is available after login.",
        buttons: [
          {
            title: "Close"
          }
        ]
      });
    }
  }
};
</script>

<style scoped>
.like {
  width: 20px;
  height: 20px;
  top: 48px;
  left: 335px;
  z-index: 10;
}
</style>
