<template>
  <window-frame
    titleText="BGM追加画面"
    display-property="private.display.addBGMWindow"
    align="right-bottom"
    fixSize="300, 365"
    @open="initWindow"
  >
    <div class="contents">
      <fieldset>
        <legend @contextmenu.prevent>読込</legend>
        <!-- URL -->
        <label class="url">
          <span @contextmenu.prevent>URL</span>
          <input
            type="text"
            v-model="url"
            ref="urlElm"
            @keydown.enter.stop
            @keyup.enter.stop
          />
        </label>
      </fieldset>
      <fieldset>
        <legend @contextmenu.prevent>表示</legend>
        <div class="firstWide">
          <!-- 表示タイトル -->
          <label class="titleStr">
            <span @contextmenu.prevent>タイトル</span>
            <input
              type="text"
              v-model="title"
              @keydown.enter.stop
              @keyup.enter.stop
            />
          </label>
        </div>
        <div class="firstWide" v-if="!isYoutube">
          <!-- クレジットURL -->
          <label class="creditUrl">
            <span @contextmenu.prevent>CreditURL</span>
            <input
              type="text"
              v-model="creditUrl"
              @keydown.enter.stop
              @keyup.enter.stop
            />
          </label>
          <!-- クレジット取得 -->
          <ctrl-button class="getCredit" @click="getCredit">取得</ctrl-button>
        </div>
      </fieldset>
      <fieldset>
        <legend @contextmenu.prevent>再生</legend>
        <div>
          <!-- タグ -->
          <label class="tag">
            <span
              title="再生中のBGMはタグによって一意になります"
              @contextmenu.prevent
              >タグ</span
            ><input
              type="text"
              v-model="tag"
              list="bgmTagComboboxValues"
              @keydown.enter.stop
              @keyup.enter.stop
            />
          </label>
          <datalist id="bgmTagComboboxValues">
            <option v-for="tag in tags" :key="tag" :value="tag">
              {{ tag }}
            </option>
          </datalist>
          <!-- 音量 -->
          <volume-component
            :initVolume="volume"
            @volume="setVolume"
            @mute="setIsMute"
            :mutable="false"
            ref="volumeComponent"
          />
          <!-- プレビュー -->
          <ctrl-button class="preview" @click="preview">プレビュー</ctrl-button>
        </div>
        <div>
          <!-- 再生時間 -->
          <label class="playLength">
            <span title="0で全て再生" @contextmenu.prevent>時間</span>
            <input
              type="number"
              min="0"
              step="0.1"
              max="10000"
              v-model="playLength"
              @keydown.enter.stop
              @keyup.enter.stop
            />
          </label>
          <!-- フェードイン -->
          <label class="fadeIn">
            <span @contextmenu.prevent>fadeIn</span>
            <input
              type="number"
              min="0"
              step="0.1"
              max="10"
              v-model="fadeIn"
              placeholder="秒"
              @keydown.enter.stop
              @keyup.enter.stop
            />
          </label>
          <!-- フェードアウト -->
          <label class="fadeOut">
            <span @contextmenu.prevent>fadeOut</span>
            <input
              type="number"
              min="0"
              step="0.1"
              max="10"
              v-model="fadeOut"
              placeholder="秒"
              @keydown.enter.stop
              @keyup.enter.stop
            />
          </label>
          <!-- 無限ループ -->
          <span
            class="icon loop"
            :class="{ active: isLoop }"
            @contextmenu.prevent
          >
            <i
              class="icon-loop"
              @click="change('isLoop')"
              :title="'リピート再生' + (isLoop ? 'あり' : 'なし')"
            ></i>
          </span>
        </div>
        <div>
          <!-- 多重再生時強制再スタート -->
          <label>
            <span @contextmenu.prevent>多重再生時強制再スタート</span>
            <input
              type="checkbox"
              v-model="forceReset"
              @keydown.enter.stop
              @keyup.enter.stop
            />
          </label>
        </div>
      </fieldset>
      <fieldset>
        <legend @contextmenu.prevent>チャット連動</legend>
        <div class="lastWide">
          <!-- チャット連動オプション -->
          <label class="option">
            <ctrl-select
              v-model="chatLinkage"
              :optionInfoList="chatLinkageOptionInfoList"
            />
          </label>
          <!-- 検索文字 -->
          <label
            class="search"
            v-show="chatLinkage === '1' || chatLinkage === '2'"
          >
            <input
              :placeholder="chatLinkage === 1 ? '' : 'Javascriptの正規表現'"
              type="text"
              v-model="chatLinkageSearch"
              @keydown.enter.stop
              @keyup.enter.stop
            />
          </label>
        </div>
      </fieldset>
      <div class="buttonArea" @contextmenu.prevent>
        <div>
          <ctrl-button @click="commit">確定</ctrl-button>
          <ctrl-button @click="cancel">キャンセル</ctrl-button>
        </div>
      </div>
    </div>
  </window-frame>
</template>

<script lang="ts">
import WindowFrame from "../WindowFrame.vue";
import WindowMixin from "../WindowMixin.vue";
import VolumeComponent from "./component/VolumeComponent.vue";
import CtrlButton from "@/components/parts/CtrlButton.vue";
import CtrlSelect from "@/components/parts/CtrlSelect.vue";

import { Watch } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({
  components: {
    CtrlSelect,
    CtrlButton,
    WindowFrame,
    VolumeComponent
  }
})
export default class AddBGMWindow extends Mixins<WindowMixin>(WindowMixin) {
  @Action("windowClose") private windowClose: any;
  @Action("addListObj") private addListObj: any;
  @Action("setProperty") private setProperty: any;
  @Getter("playerKey") private playerKey: any;

  private isYoutube: boolean = false;
  private url: string = "";
  private title: string = "";
  private creditUrl: string = "";
  private tag: string = "";
  private isLoop: boolean = false;
  private fadeIn: number = 0;
  private fadeOut: number = 0;
  private start: number = 0;
  private end: number = 0;
  private playLength: number = 0;
  private isMute: boolean = false;
  private volume: number = 0.8;
  private options: any[] = [
    { value: "0", label: "なし" },
    { value: "1", label: "末尾文字" },
    { value: "2", label: "正規表現" }
  ];
  private tags: string[] = ["BGM", "SE"];
  private chatLinkage: string = "0";
  private chatLinkageSearch: string = "";
  private forceReset: boolean = true;

  private initWindow(this: any): void {
    this.isYoutube = false;
    this.url = "";
    this.title = "";
    this.creditUrl = "";
    this.tag = "";
    this.isLoop = false;
    this.fadeIn = 0;
    this.fadeOut = 0;
    this.start = 0;
    this.end = 0;
    this.playLength = 0;
    this.isMute = false;
    this.volume = 0.8;
    this.chatLinkage = "0";
    this.chatLinkageSearch = "";
    this.forceReset = true;

    const urlElm: HTMLElement = this.$refs.urlElm;
    setTimeout(() => urlElm.focus(), 0);
  }

  private commit(): void {
    this.addListObj({
      propName: "bgm",
      kind: "bgm",
      url: this.url,
      title: this.title,
      creditUrl: this.creditUrl,
      tag: this.tag,
      isLoop: this.isLoop,
      fadeIn: Math.floor(this.fadeIn * 10) / 10,
      fadeOut: Math.floor(this.fadeOut * 10) / 10,
      playLength: Math.floor(this.playLength * 10) / 10,
      isMute: this.isMute,
      volume: this.volume,
      chatLinkage: this.chatLinkage,
      chatLinkageSearch: this.chatLinkageSearch,
      forceReset: this.forceReset,
      owner: this.playerKey
    });
    this.windowClose("private.display.addBGMWindow");
  }

  private cancel(): void {
    this.windowClose("private.display.addBGMWindow");
  }

  private getCredit(): void {
    this.creditUrl = this.url.replace(/^(https?:\/\/[^/]+).+$/, "$1");
  }

  private preview() {
    this.setProperty({
      property: "private.display.jukeboxWindow.command",
      logOff: true,
      isNotice: false,
      value: {
        command: "add",
        payload: {
          url: this.url,
          title: this.title,
          creditUrl: this.creditUrl,
          tag: this.tag,
          isLoop: this.isLoop,
          start: parseInt(String(this.start), 10),
          end: parseInt(String(this.end), 10),
          fadeIn: Math.floor(parseFloat(String(this.fadeIn)) * 10) / 10,
          fadeOut: Math.floor(parseFloat(String(this.fadeOut)) * 10) / 10,
          isMute: this.isMute,
          volume: this.volume,
          chatLinkage: this.chatLinkage,
          chatLinkageSearch: this.chatLinkageSearch,
          forceReset: this.forceReset
        }
      }
    });
  }

  private change(this: any, param: string): void {
    this[param] = !this[param];
  }

  private setIsMute(isMute: boolean): void {
    this.isMute = isMute;
  }

  private setVolume(volume: string): void {
    this.volume = Math.floor(parseFloat(volume) * 100) / 100;
  }

  private get chatLinkageOptionInfoList() {
    return this.options.map((option: any) => ({
      key: option.value,
      value: option.value,
      text: option.label
    }));
  }

  @Watch("url")
  private onChangeUrl(url: string): void {
    this.isYoutube = /www\.youtube\.com/.test(url);
  }
}
</script>

<style scoped lang="scss">
.contents {
  position: absolute;
  height: 100%;
  width: 100%;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
fieldset {
  padding-left: 5px;
  padding-right: 5px;
  padding-bottom: 5px;

  &:not(:last-child) {
    margin-bottom: 5px;
  }

  > div {
    display: flex;
    justify-content: left;
    align-content: center;

    &:not(:last-child) {
      margin-bottom: 5px;
    }
  }
}

.icon {
  display: flex;

  i {
    position: relative;
    color: black;
    border-radius: 50%;
    font-size: 12px;
    width: 1.4em;
    height: 1.4em;
    border: 2px solid black;
    display: flex;
    justify-content: center;
    align-content: flex-start;

    &:before {
      display: flex;
      justify-content: center;
      align-content: flex-start;
      position: absolute;
      top: 50%;
      margin-top: calc(-12px / 2);
    }
  }

  &:not(.active) i:hover {
    background-color: lightyellow;
  }

  &.active {
    &.loop i {
      font-weight: bold;
      background-color: deepskyblue;
    }

    &.fadeIn i {
      font-weight: bold;
      background-color: deepskyblue;
    }

    &.fadeOut i {
      font-weight: bold;
      background-color: deepskyblue;
    }
  }
}

fieldset > div i:not(:first-child) {
  margin-left: 7px;
}

.firstWide > :first-child {
  flex: 1;
}

.lastWide > :last-child {
  flex: 1;
}

input[type="text"] {
  width: 50px;
}

legend,
label,
button {
  font-size: 10px;
}

select,
input[type="text"],
input[type="number"] {
  font-size: 11px;
}

label {
  display: flex;
  justify-content: left;
  align-content: center;
  vertical-align: middle;
  white-space: nowrap;
  padding: auto;

  span {
    display: flex;
    justify-content: center;
    align-content: center;
    margin: auto;
  }

  input,
  .mask {
    flex: 1;
    padding: 2.5px 0;
  }

  .mask {
    border: 1px solid black;
    background-color: lightgray;
    padding: 2px 0;
  }
}

.volumeComponent {
  flex: 1;
}

.tag input {
  width: 52px;
}

.playLength,
.fadeIn,
.fadeOut {
  flex: 1;
  margin-right: 5px;
}

.playLength input {
  width: 45px;
}

.fadeIn input,
.fadeOut input {
  width: 32px;
}

.regexp input {
  width: 50px;
}

.buttonArea {
  display: flex;
  justify-content: center;
  align-content: flex-start;
}
</style>
