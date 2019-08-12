<template>
  <window-frame
    titleText="ようこそ"
    display-property="private.display.welcomeWindow"
    align="center"
    fixSize="500, 500"
    :fontSizeBar="tabNum !== '1'"
    :is-ban-close="!isRoomJoined"
  >
    <div class="contents" id="welcomeWindowContents">
      <!----------------------------------------------------------------------------------
       ! ロゴ
       !--------------------------------------------------------------------------------->
      <logo />

      <!----------------------------------------------------------------------------------
       ! タブ
       !--------------------------------------------------------------------------------->
      <div class="tab_wrap">
        <input
          id="welcomeWindow-tab1"
          type="radio"
          name="tab_btn"
          value="1"
          v-model="tabNum"
        />
        <input
          id="welcomeWindow-tab2"
          type="radio"
          name="tab_btn"
          value="2"
          v-model="tabNum"
        />
        <input
          id="welcomeWindow-tab3"
          type="radio"
          name="tab_btn"
          value="3"
          v-model="tabNum"
        />
        <input
          id="welcomeWindow-tab4"
          type="radio"
          name="tab_btn"
          value="4"
          v-model="tabNum"
        />

        <div class="tab_area" @contextmenu.prevent>
          <label class="tab1_label" for="welcomeWindow-tab1">
            ログイン
          </label>
          <label class="tab2_label" for="welcomeWindow-tab2">
            仕様一覧
          </label>
          <label class="tab3_label" for="welcomeWindow-tab3">
            出典元情報
          </label>
          <label class="tab4_label" for="welcomeWindow-tab4">
            開発支援
          </label>
        </div>
        <div class="panel_area">
          <!--------------------------------
           ! タブ１ - ログイン
           !------------------------------->
          <div id="panel1" class="tab_panel">
            <login />
          </div>
          <!--------------------------------
           ! タブ２ - 仕様一覧
           !------------------------------->
          <div id="panel2" class="tab_panel">
            <div class="spec-header">
              <ctrl-button class="open" @click="specAll(true)">
                全て開く
              </ctrl-button>
              <ctrl-button class="close" @click="specAll(false)">
                全て閉じる
              </ctrl-button>
            </div>
            <div class="menu">
              <environment-spec /><!-- 動作環境 -->
              <menu-bar-spec /><!-- メインメニュー -->
              <room-data-save-spec /><!-- 部屋データ保存 -->
              <room-data-load-spec /><!-- 部屋データ読込 -->
              <chat-log-save-spec /><!-- チャットログ保存 -->
              <file-upload-spec /><!-- ファイルアップローダー -->
              <edit-image-tag-spec /><!-- (画像)タグ編集 -->
              <delete-image-spec /><!-- 画像削除 -->
              <character-spec /><!-- キャラクター -->
              <chit-spec /><!-- チット -->
              <map-mask-spec /><!-- マップマスク -->
              <floor-tile-spec /><!-- フロアタイル -->
              <dice-symbol-spec /><!-- ダイスシンボル -->
              <waiting-room-spec /><!-- キャラクター待合室 -->
              <graveyard-spec /><!-- 墓場 -->
              <player-box-spec /><!-- プレイヤーボックス -->
              <chat-spec /><!-- チャット -->
              <dice-spec /><!-- ダイス -->
              <chat-palette-spec /><!-- チャットパレット -->
              <public-memo-spec /><!-- 共有メモ -->
              <change-font-size-spec /><!-- フォントサイズ変更 -->
              <initiative-spec /><!-- イニシアティブ -->
              <counter-remocon-spec /><!-- カウンターリモコン -->
              <custom-dice-bot-spec /><!-- 独自ダイスボット -->
              <bgm-spec /><!-- BGM -->
              <bgm-spec2 /><!-- BGM2 -->
              <stand-image-spec /><!-- 立ち絵 -->
              <range-spec /><!-- 範囲 -->
              <map-spec /><!-- マップ -->
              <easy-map-spec /><!-- 簡易マップ -->
              <map-save-spec /><!-- マップ状態保存 -->
              <map-load-spec /><!-- マップ切り替え -->
              <reset-all-window-spec /><!-- ウィンドウ配置初期化機能 -->
              <welcome-window-spec /><!-- ようこそ画面 -->
              <room-info-spec /><!-- プレイルーム情報 -->
              <version-spec /><!-- バージョン -->
              <official-site-link-spec /><!-- オフィシャルサイト -->
              <logout-spec /><!-- ログアウト -->
            </div>
            <span class="toTop" @click="scrollTo()">
              <span class="rotate90">＜</span>
              <span>TOP</span>
            </span>
          </div>
          <!--------------------------------
           ! タブ３ - 出典元情報
           !------------------------------->
          <div id="panel3" class="tab_panel">
            <Source />
          </div>
          <!--------------------------------
           ! タブ４ - 開発支援
           !------------------------------->
          <div id="panel4" class="tab_panel">
            <dev-support />
          </div>
        </div>
      </div>
      <!-- tab_wrap -->
    </div>
  </window-frame>
</template>

<script lang="ts">
import WindowFrame from "../WindowFrame.vue";
import WindowMixin from "../WindowMixin.vue";
import CtrlButton from "@/components/parts/CtrlButton.vue";

import { Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

import Login from "./login/Login.vue";
import Logo from "../simple/Logo.vue";
import Source from "./source/Source.vue";
import DevSupport from "./devSupport/DevSupport.vue";

import EnvironmentSpec from "./spec/EnvironmentSpec.vue";
import MenuBarSpec from "./spec/MenuBarSpec.vue";
import RoomDataSaveSpec from "./spec/RoomDataSaveSpec.vue";
import RoomDataLoadSpec from "./spec/RoomDataLoadSpec.vue";
import ChatSpec from "./spec/ChatSpec.vue";
import DiceSpec from "./spec/DiceSpec.vue";
import PlayerBoxSpec from "./spec/PlayerBoxSpec.vue";
import ChangeFontSizeSpec from "./spec/ChangeFontSizeSpec.vue";
import ResetAllWindowSpec from "./spec/ResetAllWindowSpec.vue";
import CharacterSpec from "./spec/CharacterSpec.vue";
import RangeSpec from "./spec/RangeSpec.vue";
import ChitSpec from "./spec/ChitSpec.vue";
import GraveyardSpec from "./spec/GraveyardSpec.vue";
import WaitingRoomSpec from "./spec/WaitingRoomSpec.vue";
import MapSpec from "./spec/MapSpec.vue";
import FloorTileSpec from "./spec/FloorTileSpec.vue";
import MapMaskSpec from "./spec/MapMaskSpec.vue";
import EasyMapSpec from "./spec/EasyMapSpec.vue";
import MapSaveSpec from "./spec/MapSaveSpec.vue";
import MapLoadSpec from "./spec/MapLoadSpec.vue";
import FileUploadSpec from "./spec/FileUploadSpec.vue";
import EditImageTagSpec from "./spec/EditImageTagSpec.vue";
import DeleteImageSpec from "./spec/DeleteImageSpec.vue";
import WelcomeWindowSpec from "./spec/WelcomeWindowSpec.vue";
import VersionSpec from "./spec/VersionSpec.vue";
import OfficialSiteLinkSpec from "./spec/OfficialSiteLinkSpec.vue";
import RoomInfoSpec from "./spec/RoomInfoSpec.vue";
import PublicMemoSpec from "./spec/PublicMemoSpec.vue";
import LogoutSpec from "./spec/LogoutSpec.vue";
import InitiativeSpec from "./spec/InitiativeSpec.vue";
import CounterRemoconSpec from "./spec/CounterRemoconSpec.vue";
import BgmSpec from "./spec/BgmSpec.vue";
import BgmSpec2 from "./spec/BgmSpec2.vue";
import DiceSymbolSpec from "./spec/DiceSymbolSpec.vue";
import CustomDiceBotSpec from "./spec/CustomDiceBotSpec.vue";
import StandImageSpec from "./spec/StandImageSpec.vue";
import ChatPaletteSpec from "./spec/ChatPaletteSpec.vue";
import ChatLogSaveSpec from "./spec/ChatLogSaveSpec.vue";

@Component({
  components: {
    CtrlButton,
    WindowFrame,
    Logo,
    Login,
    EnvironmentSpec,
    MenuBarSpec,
    RoomDataSaveSpec,
    RoomDataLoadSpec,
    ChatSpec,
    DiceSpec,
    PlayerBoxSpec,
    InitiativeSpec,
    ChangeFontSizeSpec,
    ResetAllWindowSpec,
    CharacterSpec,
    RangeSpec,
    ChitSpec,
    GraveyardSpec,
    WaitingRoomSpec,
    MapSpec,
    FloorTileSpec,
    MapMaskSpec,
    EasyMapSpec,
    MapSaveSpec,
    MapLoadSpec,
    FileUploadSpec,
    EditImageTagSpec,
    DeleteImageSpec,
    WelcomeWindowSpec,
    VersionSpec,
    OfficialSiteLinkSpec,
    RoomInfoSpec,
    PublicMemoSpec,
    LogoutSpec,
    Source,
    DevSupport,
    BgmSpec,
    BgmSpec2,
    CustomDiceBotSpec,
    StandImageSpec,
    CounterRemoconSpec,
    DiceSymbolSpec,
    ChatPaletteSpec,
    ChatLogSaveSpec
  }
})
export default class WelcomeWindow extends Mixins<WindowMixin>(WindowMixin) {
  @Getter("isRoomJoined") private isRoomJoined: any;
  @Getter("version") private version: any;

  private tabNum: string = "1";

  specAll(openFlg: boolean) {
    const elms = document
      .getElementById("welcomeWindowContents")!
      .querySelectorAll("input[type=checkbox]");
    Array.prototype.slice
      .call(elms)
      .filter(elm => elm.checked !== openFlg)
      .forEach(elm => elm.click());
  }

  scrollTo(target: string | undefined) {
    const contentsElm: HTMLElement = document.getElementById(
      "welcomeWindowContents"
    )!;
    setTimeout(() => {
      contentsElm.scrollTop = 0;
    }, 0);
  }
}
</script>

<style scoped lang="scss">
.contents {
  /*position: absolute;*/
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-direction: column;
}

.tab_wrap {
  width: 100%;
  flex: 1;
  margin: 0;
  display: flex;
  flex-direction: column;
}
input[type="radio"] {
  display: none;
}
.tab_area {
  font-size: 0;
  margin: 0;
  z-index: 10;

  label {
    width: 23.5%;
    margin: 0 0 0 1.2%;
    box-sizing: border-box;
    display: inline-block;
    padding: 0.2em 0;
    color: #999;
    background: #ddd;
    text-align: center;
    font-size: 13px;
    cursor: pointer;
    /*transition: ease 0.2s opacity;*/
    border: 1px solid #777;
    border-top-left-radius: 0.5em;
    -webkit-border-top-left-radius: 0.5em;
    -moz-border-top-left-radius: 0.5em;
    border-top-right-radius: 0.5em;
    -webkit-border-top-right-radius: 0.5em;
    -moz-border-top-right-radius: 0.5em;
  }
}
/*.tab_area label:hover { opacity:0.5; }*/
.panel_area {
  /*background:#fff;*/
  /*border: 1px solid red;*/
  margin-top: -1px;
  /*padding: 0 0.5em 0.5em;*/
  flex: 1;
  display: flex;
}
.tab_panel {
  padding: 0;
  display: none;
  flex: 1;
  width: 100%;
  white-space: normal;

  p {
    font-size: 14px;
    letter-spacing: 1px;
    text-align: center;
  }
}

#welcomeWindow-tab1:checked ~ .tab_area .tab1_label,
#welcomeWindow-tab2:checked ~ .tab_area .tab2_label,
#welcomeWindow-tab3:checked ~ .tab_area .tab3_label,
#welcomeWindow-tab4:checked ~ .tab_area .tab4_label {
  background: #fff;
  color: #000;
  border-bottom-color: transparent;
}
#welcomeWindow-tab1:checked ~ .panel_area #panel1,
#welcomeWindow-tab2:checked ~ .panel_area #panel2,
#welcomeWindow-tab3:checked ~ .panel_area #panel3,
#welcomeWindow-tab4:checked ~ .panel_area #panel4 {
  display: flex;
  flex-direction: column;
}

.spec-header {
  padding: 0.2rem;
  border: 1px solid #777;
  border-bottom: none;
  background-color: white;
  line-height: 1em;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  min-height: 1.4em;

  button {
    background-color: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    padding: 0 0 0 1em;
    margin-right: 0.5rem;
    position: relative;
    color: rgb(90, 131, 177);
    font-size: 90%;
    box-sizing: border-box;

    &:hover {
      color: rgb(231, 50, 45);
    }

    &.open:before {
      border-top: 0.4em solid rgb(90, 131, 177);
      transform: translateY(-25%);
    }

    &.close:before {
      border-bottom: 0.4em solid rgb(90, 131, 177);
      transform: translateY(-75%);
    }

    &.close:hover:before {
      border-bottom-color: rgb(231, 50, 45);
    }

    &.open:hover:before {
      border-top-color: rgb(231, 50, 45);
    }

    &:before {
      content: "";
      width: 0;
      height: 0;
      position: absolute;
      top: 50%;
      left: 0;
      border: 0.4em solid transparent;
    }
  }
}

.menu {
  padding: 0 0.5em 0.5em;
  background-color: white;
  border: 1px solid #777;
  border-top: none;
}

.toTop {
  position: absolute;
  bottom: 0.5rem;
  right: 1.5rem;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  background-color: rgb(50, 146, 246);
  color: rgb(227, 253, 255);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 1px 1px 2px #94866a;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    background-color: rgb(30, 126, 226);
  }
}
.rotate90 {
  transform: rotate(90deg);
}
</style>
