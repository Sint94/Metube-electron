/*---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *--------------------------------------------------------------------------------------------*/

'use strict';

<template>
  <div>
    <top-header @my-sync="getMyCollection"/>
    <div class="wrapper">
      <!-- 비로그인 상태 -->
      <el-row v-if="!isLogin">
        <el-col class="notLogin">{{ $t('COLLECTION.NO_LOGIN') }}</el-col>
        <el-col class="link">
          <md-button
            class="md-raised md-primary btn"
            @click="signLink"
          >{{ $t('COLLECTION.NO_LOGIN_BUTTON_LINK') }}</md-button>
        </el-col>
      </el-row>

      <!-- 로그인 상태 -->
      <el-row v-if="isLogin">
        <el-col>
          <div class="menu1_tip">
            <div>
              <img width="20" style="margin-bottom: 10px;" src="@/assets/images/svg/collection.svg">
              <span class="collections">{{ $t('COLLECTION.MENU.COLLECTION') }}</span>
            </div>
            <strong class="tr" style="font-size:11px;">{{ $t('COLLECTION.INDEX') }}</strong>
          </div>
        </el-col>
      </el-row>

      <el-row v-if="isLogin" class="el-scroll" :class="{ dynamicHeight: isSub }">
        <!-- 상위4개 재생목록 -->
        <el-col>
          <div class="menu1">
            <label class="wh">
              <strong style="margin-left: 5px;">MY COLLECTIONS</strong>
              <small class="more" v-if="isLogin">
                <a class="cursor" @click="showCollectionList('my-collection')">（more）</a>
              </small>
            </label>
            <!-- <md-button class="md-raised b-primary c-add" @click="collectionAdd">add</md-button> -->
          </div>
        </el-col>

        <el-col
          class="noList"
          v-if="isLogin && myCollections.length === 0"
        >{{ $t('COLLECTION.NO_PLAYLIST') }}</el-col>

        <el-col v-else class="cols" v-for="item in myCollections" :key="item._id" :span="12">
          <el-card class="thumb" :body-style="{ padding: '0px' }">
            <div class="overlay">
              <img class="md-image thumbnail" :src="item.thumbnails" width="158" height="100">
              <div class="myCollectionLabel">
                <span class="label_related label_v">{{ item.category }}</span>
              </div>
              <div class="playWrapper">
                <div class="overlayMenu">
                  <a class="cursor" @click="showMyCollectionList(item)" title="Play">
                    <font-awesome-icon class="f25 fa" icon="play"/>
                  </a>
                  <a class="cursor" @click="showRemove(item)" title="Remove">
                    <font-awesome-icon class="f25 fa" icon="times"/>
                  </a>
                  <a class="cursor" @click="showCoverModal(item)" title="Cover change">
                    <font-awesome-icon class="f25 fa" icon="images"/>
                  </a>
                </div>
              </div>
            </div>
            <div class="channelForm">
              <div class="titleflow">
                <span class="sub">{{ item.title }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col>
          <div class="menu1">
            <label class="wh">
              <strong style="margin-left: 5px;">{{ $t('COLLECTION.MENU.PLAY_LIST') }}</strong>
              <small class="more" v-if="isLogin">
                <a class="cursor" @click="showCollectionList('play')">（more）</a>
              </small>
            </label>
          </div>
        </el-col>

        <el-col
          class="noList"
          v-if="isLogin && playlists.length === 0"
        >{{ $t('COLLECTION.NO_PLAYLIST') }}</el-col>

        <el-col v-else class="cols" v-for="item in playlists" :key="item._id" :span="12">
          <el-card class="thumb" :body-style="{ padding: '0px' }">
            <div class="overlay">
              <img class="md-image thumbnail" :src="item.thumbnails" width="158" height="100">
              <div class="playWrapper">
                <div class="overlayMenu">
                  <a class="cursor" @click="showMusicList(item)" title="Play">
                    <font-awesome-icon class="f25 fa" icon="play"/>
                  </a>
                  <a class="cursor" @click="showRemove(item)" title="Remove">
                    <font-awesome-icon class="f25 fa" icon="times"/>
                  </a>
                  <a class="cursor" @click="showCoverModal(item)" title="Cover change">
                    <font-awesome-icon class="f25 fa" icon="images"/>
                  </a>
                </div>
              </div>
            </div>
            <div class="channelForm">
              <div class="titleflow">
                <span class="sub">{{ item.title }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <!-- // end 상위4개 재생목록 -->
        <!-- 상위4개 채널목록 -->
        <el-col>
          <div class="menu1">
            <label class="wh">
              <strong style="margin-left: 5px;">{{ $t('COLLECTION.MENU.CHANNEL') }}</strong>
              <small class="more" v-if="isLogin">
                <a class="cursor" @click="showCollectionList('channel')">（more）</a>
              </small>
            </label>
          </div>
        </el-col>

        <el-col
          class="noList"
          v-if="isLogin && channelLists.length === 0"
        >{{ $t('COLLECTION.NO_CHANNEL') }}</el-col>

        <el-col v-else class="cols" v-for="item in channelLists" :key="item._id" :span="12">
          <el-card class="thumb" :body-style="{ padding: '0px' }">
            <div class="overlay">
              <img class="thumbnail channelThumb" :src="item.thumbnails" width="158" height="100">
              <div class="playWrapper channelWrapper">
                <div class="overlayMenu channelMenu">
                  <a class="cursor" @click="showMusicList(item)" title="Play">
                    <font-awesome-icon class="f30 fa" icon="play"/>
                  </a>
                  <a class="cursor" @click="showRemove(item)" title="Remove">
                    <font-awesome-icon class="f30 fa" icon="times"/>
                  </a>
                </div>
              </div>
            </div>
            <div class="channelForm">
              <div class="titleflow">
                <span class="sub">{{ item.title }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <!-- // end 상위4개 채널목록 -->
      </el-row>
    </div>

    <!-- 서브 플레이어 컴포넌트 -->
    <sub-player-bar v-show="isSub"/>

    <!-- 커버 이미지 변경 -->
    <cover-change-modal ref="coverModal" :data="selectedData" @is-success="saveCover"/>

    <collection-register
      ref="likes"
      :isLikeToggle="true"
      :data="data"
      :playType="playType"
      @toggle="toggleChange"
      @callback="albumRemoveCallback"
      style="visibility: hidden"
    />
  </div>
</template>

<script>
import CollectionQueryMixin from "@/components/Mixin/collections";
import MyQueryMixin from "@/components/Mixin/mycollection";
import StoreMixin from "@/components/Mixin/index";
import DataUtils from "@/components/Mixin/db";
import CoverChangeModal from "./cover/CollectionCoverChange";
import CollectionRegister from "@/components/Collections/regist/CollectionRegister";
import SubPlayerBar from "@/components/PlayerBar/SubPlayerBar";
import Loading from "@/components/Loader/Loader";

export default {
  name: "Collections",
  mixins: [StoreMixin, CollectionQueryMixin, MyQueryMixin, DataUtils],
  components: {
    CollectionRegister,
    CoverChangeModal,
    SubPlayerBar,
    Loading
  },
  data() {
    return {
      activeName: "first",
      playlists: [],
      playlistId: null,
      playType: null,
      channelLists: [],
      myCollections: [],
      load: false,
      isSub: false,
      isLikeToggle: false,
      isLogin: false,
      data: null,
      selectedData: null
    };
  },
  created() {
    // login user
    this.isLogin = this.getUserId() ? true : false;
  },
  beforeMount() {
    this.$store.commit("setIndexPath", this.$route.path);
  },
  mounted() {
    /** @overide */
    this.getMyCollection();

    /** @overide */
    this.getPlaylist();

    /** @overide */
    this.getChannelList();
  },
  methods: {
    collectionAdd() {
      this.isCreate = true;
    },
    showRemove(data) {
      this.$modal.show("dialog", {
        title: "Info",
        text: this.$t("COLLECTION.REMOVE_ALBUM"),
        buttons: [
          {
            title: "Yes",
            handler: () => {
              this.$set(this, "data", data);
              this.$set(this, "playType", data.playType);
              if (data.category) {
                /** @overide 내 콜렉션 제거 */
                this.myCollectionRemove(data, "index");
              } else {
                /** @overide 그외 콜렉션 제거 */
                this.albumRemoveCallback(data);
              }
            }
          },
          {
            title: "Close"
          }
        ]
      });
    },
    toggleChange(value) {
      this.isLikeToggle = value;
    },
    showMyCollectionList(item) {
      this.$store.commit("setPath", this.$route.path);
      this.$router.push({
        name: "NOT-MY-PLAYLIST",
        params: {
          playType: "self",
          doc: item
        }
      });
    },
    showMusicList(item) {
      this.$store.commit("setPath", this.$route.path);
      this.$router.push({
        name: "NOT-PLAYING-PLAYLIST",
        params: {
          playType: item.playType,
          id: item.playType === "play" ? item.playlistId : item.channelId
        }
      });
    },
    showCollectionList(type) {
      this.$store.commit("setPath", this.$route.path);
      this.$router.push({
        name: "COLLECTION-LIST",
        params: {
          playType: type
        }
      });
    },
    showCoverModal(item) {
      this.$refs.coverModal.showModal();
      this.$set(this, "selectedData", item);
    },
    saveCover(data) {
      if (data) {
        if (data.playType === "play") {
          this.getPlaylist();
        } else if (data.playType === "channel") {
          this.getChannelList();
        } else {
          this.getMyCollection();
        }
      }
    },
    signLink() {
      this.$router.push({
        name: "login"
      });
    }
  }
};
</script>

<style scoped>
.btn {
  color: #ffffff;
  background: #448aff;
  width: 140px;
}

.c-add {
  float: right;
  color: #ffffff;
  min-width: 40px;
  height: 20px;
  margin-bottom: 0;
}

.dynamicHeight {
  height: 410px !important;
}

.el-card {
  border: none;
  border-radius: 0px;
  background-color: rgba(255, 255, 255, 0);
  color: #303133;
  -webkit-transition: 0.3s;
  transition: 0.3s;
}
</style>
