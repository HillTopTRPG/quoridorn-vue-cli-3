<template>
  <WindowFrame titleText="チャット" display-property="private.display.chatWindow" align="left-bottom" baseSize="-300, 260" :fontSizeBar="true">
    <div class="container">
      <!----------------
       ! タブ
       !--------------->
      <div class="tabs dep">
        <span class="tab"
              v-for="(tabObj, index) in chatTabList"
              :key="tabObj.name"
              :class="{ active: tabObj.name === activeTab, unRead: tabObj.unRead > 0 }"
              @mousedown.prevent="selectChatTab(tabObj.name)"
              :tabindex="index + 1"
        >#{{tabObj.name}}/{{tabObj.unRead}}</span>
        <span class="tab addButton" @click="addTab" :tabindex="chatTabList.length + 1"><span class="icon-cog"></span></span>
      </div>
      <!----------------
       ! チャットログ
       !--------------->
      <ul id="chatLog" @wheel.stop>
        <li v-for="(chatLog, index) in chatLogList" v-html="chatLog.viewHtml" :key="index"></li>
      </ul>
      <!----------------
       ! 操作盤
       !--------------->
      <label class="oneLine dep">
        <span class="label">名前(！)</span>
        <select :tabindex="chatTabList.length + 2" :value="currentChatKey" @change="event => inputName(event.target.value)" title="">
          <option v-for="actor in getPeerActors" :key="actor.key" :value="actor.key">{{getViewName(actor.key)}}</option>
        </select>
        <DiceBotSelect ref="diceBot" v-model="currentDiceBotSystem" :tabindex="chatTabList.length + 6" class="diceBotSystem"/>
        <span class="icon"><i class="icon-dice" title="ダイスボットの設定" @click="settingDiceBot" :tabindex="chatTabList.length + 7"></i></span>
        <!--<span class="icon"><i class="icon-font" title="フォントの設定" @click="settingFont" :tabindex="chatTabList.length + 8"></i></span>-->
        <span class="icon"><i class="icon-music" title="BGMの設定" @click="settingBGM" :tabindex="chatTabList.length + 8"></i></span>
      </label>
      <!----------------
       ! 発言
       !--------------->
      <div class="sendLine dep">
        <div class="textAreaContainer">
          <!----------------
           ! グループチャットタブ
           !--------------->
          <div class="tabs">
            <span class="tab"
                  v-for="(tabObj, index) in groupTargetTabList"
                  :key="tabObj.key"
                  :class="{ active: tabObj.key === chatTarget }"
                  @mousedown.prevent="groupTargetTabSelect(tabObj.key)"
                  :tabindex="chatTabList.length + 12 + index"
            >> {{tabObj.name}}{{otherMatcherObj(tabObj) ? `(${getViewName(otherMatcherObj(tabObj))})` : ''}}</span>
            <span class="tab addButton"
                  @click="addTargetTab"
                  :tabindex="chatTabList.length + chatTabList.length + 12"
            ><span class="icon-cog"></span></span>
            <label class="bracketOption">
              <input type="checkbox" v-model="addBrackets" :tabindex="chatTabList.length + chatTabList.length + 13" />
              発言時に「」を付与
            </label>
          </div>
          <!----------------
           ! チャットオプション（送信者）
           !--------------->
          <div class="chatOptionSelector dep" v-if="chatOptionSelectMode === 'from'">
            <span>送信者{{chatOptionPageMaxNum > 1 ? ` (${chatOptionPageNum} / ${chatOptionPageMaxNum})` : ''}}</span>
            <ul>
              <li class="ope" v-if="chatOptionPageMaxNum > 1 && chatOptionPageNum === 1">[末尾へ]</li>
              <li class="ope" v-if="chatOptionPageMaxNum > 1 && chatOptionPageNum !== 1">[前へ]</li>
              <li v-for="actor in getPeerActors"
                  :key="actor.key"
                  :class="{selected: currentChatKey === actor.key}"
                  tabindex="-1"
              >{{getViewName(actor.key)}}</li>
              <li class="ope" v-if="chatOptionPageMaxNum > 1 && chatOptionPageNum !== chatOptionPageMaxNum">[次へ]</li>
              <li class="ope" v-if="chatOptionPageMaxNum > 1 && chatOptionPageNum === chatOptionPageMaxNum">[先頭へ]</li>
            </ul>
          </div>
          <!----------------
           ! チャットオプション（対象）
           !--------------->
          <div class="chatOptionSelector dep" v-if="chatOptionSelectMode === 'target'">
            <span>送信先{{chatOptionPageMaxNum > 1 ? ` (${chatOptionPageNum} / ${chatOptionPageMaxNum})` : ''}}</span>
            <ul>
              <li class="ope" v-if="chatOptionPageMaxNum > 1 && chatOptionPageNum === 1">[末尾へ]</li>
              <li class="ope" v-if="chatOptionPageMaxNum > 1 && chatOptionPageNum !== 1">[前へ]</li>
              <li v-for="target in chatOptionPagingList"
                  :key="target.key"
                  :class="{selected: chatTarget === target.key}"
                  tabindex="-1"
              >{{getViewName(target.key)}}</li>
              <li class="ope" v-if="chatOptionPageMaxNum > 1 && chatOptionPageNum !== chatOptionPageMaxNum">[次へ]</li>
              <li class="ope" v-if="chatOptionPageMaxNum > 1 && chatOptionPageNum === chatOptionPageMaxNum">[先頭へ]</li>
            </ul>
          </div>
          <!----------------
           ! チャットオプション（タブ）
           !--------------->
          <div class="chatOptionSelector dep" v-if="chatOptionSelectMode === 'tab'">
            <span>出力先のタブ{{chatOptionPageMaxNum > 1 ? ` (${chatOptionPageNum} / ${chatOptionPageMaxNum})` : ''}}</span>
            <ul>
              <li class="ope" v-if="chatOptionPageMaxNum > 1 && chatOptionPageNum === 1">[末尾へ]</li>
              <li class="ope" v-if="chatOptionPageMaxNum > 1 && chatOptionPageNum !== 1">[前へ]</li>
              <li :class="{selected: outputTab === '[選択中]'}">[選択中]</li>
              <li
                v-for="tab in chatTabList"
                :key="tab.key"
                :class="{selected: outputTab === tab.name}"
                tabindex="-1"
              >{{tab.name}}</li>
              <li class="ope" v-if="chatOptionPageMaxNum > 1 && chatOptionPageNum !== chatOptionPageMaxNum">[次へ]</li>
              <li class="ope" v-if="chatOptionPageMaxNum > 1 && chatOptionPageNum === chatOptionPageMaxNum">[先頭へ]</li>
            </ul>
          </div>
          <label class="chatInputArea">
            <span class="chatOption" @click="clickChatOption">
              <span class="emphasis">! {{getViewName(currentChatKey)}}</span>
              <span :class="{emphasis: chatTarget !== 'groupTargetTab-0'}">> {{getGroupTargetName()}}</span>
              <span :class="{emphasis: outputTab !== '[選択中]'}"># {{outputTab}}</span>
            </span>
            <!----------------
             ! 入力欄
             !--------------->
            <textarea id="chatTextArea"
                      v-model="currentMessage"
                      @input="onInput"
                      @blur="blurTextArea"
                      @keydown.up="event => chatOptionSelectChange('up', event)"
                      @keydown.down="event => chatOptionSelectChange('down', event)"
                      @keydown.esc.prevent="pressEsc"
                      @keypress.enter.prevent="event => sendMessage(event, true)"
                      @keyup.enter.prevent="event => sendMessage(event, false)"
                      :tabindex="chatTabList.length + chatTabList.length + 14"
                      :placeholder="'メッセージ（改行はShift + Enter）'"
            ></textarea>
          </label>
        </div>
        <button :tabindex="chatTabList.length + chatTabList.length + 15">送信</button>
      </div>
      <!----------------
       ! 入力者表示
       !--------------->
      <div class="inputtingArea dep">
        <div
          v-for="name in inputtingPeerIdList"
          :key="name"
        >
          <img
            alt=""
            v-show="inputtingPeerIdList.length>0"
            :src="require('../../assets/inputting.gif')"
          >
          {{createInputtingMsg(name)}}
        </div>
      </div>
    </div>
  </WindowFrame>
</template>

<script lang="ts">
import DiceBotSelect from "../parts/DiceBotSelect.vue";

import { Component, Vue, Watch } from "vue-property-decorator";
import { Action, Getter, Mutation } from "vuex-class";
import WindowMixin from "../WindowMixin.vue";
import WindowFrame from "../WindowFrame.vue";

@Component<ChatWindow>({
  name: "chatWindow",
  mixins: [WindowMixin],
  components: {
    WindowFrame,
    DiceBotSelect
  }
})
export default class ChatWindow extends Vue {
  @Action("addChatLog") addChatLog: any;
  @Action("chatTabSelect") chatTabSelect: any;
  @Action("windowOpen") windowOpen: any;
  @Action("setProperty") setProperty: any;
  @Action("sendRoomData") sendRoomData: any;
  @Mutation("updateActorKey") updateActorKey: any;
  @Getter("getPeerActors") getPeerActors: any;
  @Getter("getViewName") getViewName: any;
  @Getter("getObj") getObj: any;
  @Getter("chatLogList") chatLogList: any;
  @Getter("chatTabList") chatTabList: any;
  @Getter("playerList") playerList: any;
  @Getter("groupTargetTabList") groupTargetTabList: any;
  @Getter("members") members: any;
  @Getter("currentChatKey") currentChatKey: any;
  @Getter("inputting") inputting: any;
  @Getter("createInputtingMsg") createInputtingMsg: any;
  @Getter("fontColor") fontColor: any;
  @Getter("chatTargetList") chatTargetList: any;
  @Getter("activeTab") activeTab: any;
  @Getter("hoverTab") hoverTab: any;
  @Getter("playerKey") playerKey: any;
  @Getter("chatOptionPagingSize") chatOptionPagingSize: any;
  @Getter("isWait") isWait: any;
  @Getter("chatActorKey") chatActorKey: any;

  private enterPressing: boolean = false;
  /** 入力されたチャット文字 */
  private currentMessage: string = "";
  /** 発言時に「」を付与するかどうか */
  private addBrackets: boolean = false;
  /** チャットオプション入力モード('tab':# or 'target':@ or '') */
  private chatOptionSelectMode: string = "";
  /** 発言先 */
  private chatTarget: string = "groupTargetTab-0";
  /** 出力先のタブ */
  private outputTab: string = "[選択中]";
  /** 選択されているシステム */
  private currentDiceBotSystem: string = "DiceBot";
  /** 秘匿チャットの相手 */
  private secretTarget: string = "";
  /** 入力中のルームメンバーのpeerIdの配列 */
  private inputtingPeerIdList: any[] = [];

  private volatileFrom: string = "";
  private volatileTarget: string = "";
  private volatileActiveTab: string = "";
  private volatileTargetTab: string = "";

  onInput(event: any): void {
    const text = event.target.value;

    let selectFrom: string = "";
    if (text.startsWith("!") || text.startsWith("！")) {
      const useText = text.substring(1);
      if (useText.length === 0) {
        selectFrom = this.currentChatKey;
      }
      this.getPeerActors.forEach((target: any) => {
        if (selectFrom) return;
        if (this.getViewName(target.key).startsWith(useText)) {
          selectFrom = target.key;
        }
      });
    }

    let selectTarget: string = "";
    if (text.startsWith(">") || text.startsWith("＞")) {
      const useText = text.substring(1);
      if (useText.length === 0) {
        selectTarget = this.chatTarget;
      }
      this.chatTargetList.forEach((target: any) => {
        if (selectTarget) return;
        if (target.name.startsWith(useText)) {
          selectTarget = target.key;
        }
      });
    }

    let selectTab: string = "";
    if (text.startsWith("#") || text.startsWith("＃")) {
      const useText = text.substring(1);
      if (useText.length === 0) {
        selectTab = this.outputTab;
      }
      const selection = [
        "[選択中]",
        ...this.chatTabList.map((tab: any) => tab.name)
      ];
      selection.forEach((tabName: string) => {
        if (selectTab) return;
        if (tabName.startsWith(useText)) selectTab = tabName;
      });
    }

    if (selectFrom) {
      this.chatOptionSelectMode = "from";
      this.setProperty({
        property: "private.self.currentChatKey",
        value: selectFrom,
        isNotice: false,
        logOff: true
      });
    } else if (selectTarget) {
      this.chatOptionSelectMode = "target";
      this.chatTarget = selectTarget;
    } else if (selectTab) {
      this.chatOptionSelectMode = "tab";
      this.outputTab = selectTab;
    } else {
      this.chatOptionSelectMode = "";
      this.sendRoomData({
        type: "NOTICE_INPUT",
        value: { key: this.currentChatKey, target: this.chatTarget },
        isWait: this.isWait
      });
    }
  }
  getGroupTargetName(): void {
    let target = this.getObj(this.chatTarget);
    return target ? this.getViewName(target.key) : null;
  }
  /**
   * 上下キーを押下されてチャットオプションの選択項目を移動させる処理
   */
  chatOptionSelectChange(direction: string, event: any): void {
    // 変化前の値を保存
    if (!this.volatileFrom) this.volatileFrom = this.currentChatKey;
    if (!this.volatileTarget) this.volatileTarget = this.chatTarget;
    if (!this.volatileActiveTab) this.volatileActiveTab = this.activeTab;
    if (!this.volatileTargetTab) this.volatileTargetTab = this.outputTab;

    // カーソル移動と、移動後の輪転処理
    const arrangeIndex = (list: any[], index: number) => {
      index += direction === "up" ? -1 : 1;
      if (index < 0) index = list.length - 1;
      if (index === list.length) index = 0;
      return list[index];
    };

    // 発言者の選択の場合
    if (this.chatOptionSelectMode === "from") {
      event.preventDefault();
      let index = this.getPeerActors.findIndex(
        (s: any) => s.key === this.currentChatKey
      );
      const newValue = arrangeIndex(this.getPeerActors, index);

      this.setProperty({
        property: "private.self.currentChatKey",
        value: newValue.key,
        isNotice: false,
        logOff: true
      });
    }

    // 発言先の選択の場合
    if (this.chatOptionSelectMode === "target") {
      event.preventDefault();
      let index = this.chatTargetList.findIndex(
        (s: any) => s.key === this.chatTarget
      );
      const newValue = arrangeIndex(this.chatTargetList, index);

      this.groupTargetTabSelect(newValue.key);
    }

    // タブの選択の場合
    if (this.chatOptionSelectMode === "tab") {
      const selection = [
        "[選択中]",
        ...this.chatTabList.map((tab: any) => tab.name)
      ];

      event.preventDefault();
      let index = selection.indexOf(this.outputTab);
      const newValue = arrangeIndex(selection, index);

      this.selectChatTab(
        newValue !== "[選択中]" ? newValue : this.volatileActiveTab
      );
      this.outputTab = newValue;
    }
  }
  /**
   * 入力欄からフォーカスが外れた場合
   */
  blurTextArea(): void {
    this.resetChatOption();
  }
  /**
   * 入力欄でESCキーを押下した場合
   */
  pressEsc(): void {
    this.resetChatOption();
  }
  /**
   * チャットオプションを仮変更前の状態に戻す
   */
  resetChatOption(): void {
    if (this.chatOptionSelectMode) {
      this.currentMessage = "";
      if (this.volatileFrom)
        this.setProperty({
          property: "private.self.currentChatKey",
          value: this.volatileFrom,
          isNotice: false,
          logOff: true
        });
      if (this.volatileTarget) this.chatTarget = this.volatileTarget;
      if (this.volatileActiveTab) this.selectChatTab(this.volatileActiveTab);
      if (this.volatileTargetTab) this.outputTab = this.volatileTargetTab;
    }
    this.chatOptionSelectMode = "";
    this.volatileFrom = "";
    this.volatileTarget = "";
    this.volatileActiveTab = "";
    this.volatileTargetTab = "";
  }
  selectChatTab(name: string): void {
    this.setProperty({
      property: "chat.activeTab",
      value: name,
      logOff: true
    });
    this.chatTabSelect(name);
  }
  groupTargetTabSelect(targetKey: string): void {
    this.chatTarget = targetKey;

    if (targetKey.split("-")[0] === "groupTargetTab") {
      const tabObj = this.getObj(this.chatTarget);
      if (tabObj.targetTab) this.outputTab = tabObj.targetTab;
      const otherObj: any = this.otherMatcherObj(tabObj);
      if (otherObj) {
        this.setProperty({
          property: "private.self.currentChatKey",
          value: otherObj.key,
          isNotice: false,
          logOff: true
        });
      }
    }
  }
  inputName(key: string): void {
    this.updateActorKey(key);
    this.setProperty({
      property: "private.self.currentChatKey",
      value: key,
      logOff: false
    });
  }
  clickChatOption(): void {
    document.getElementById("chatTextArea")!.focus();
  }
  addTab(): void {
    this.windowOpen("private.display.settingChatTabWindow");
  }
  addTargetTab(): void {
    this.windowOpen("private.display.settingChatTargetTabWindow");
  }
  settingDiceBot(): void {
    this.setProperty({
      property: "private.display.unSupportWindow.title",
      value: "ダイスボット用表管理",
      logOff: true
    });
    this.windowOpen("private.display.unSupportWindow");
  }
  settingFont(): void {
    this.windowOpen("private.display.settingChatFontWindow");
  }
  settingBGM(): void {
    this.windowOpen("private.display.settingBGMWindow");
  }
  commitChatOption(): void {
    if (this.chatOptionSelectMode) {
      this.currentMessage = "";
    }
    this.chatOptionSelectMode = "";
    this.volatileFrom = "";
    this.volatileTarget = "";
    this.volatileActiveTab = "";
    this.volatileTargetTab = "";
  }
  sendMessage(this: any, event: any, flg: boolean): void {
    if (this.enterPressing === flg) return;
    this.enterPressing = flg;
    if (!flg) return;
    if (event.shiftKey) {
      this.currentMessage += "\r\n";
      return;
    }
    if (this.currentMessage === "") return;

    // チャット送信オプション選択中のEnterは特別仕様
    if (this.chatOptionSelectMode) {
      this.commitChatOption();
      return;
    }

    // 文字色決定
    const actor = this.getPeerActors.filter(
      (actor: any) => actor.key === this.chatActorKey
    )[0];
    let color = "black";
    if (actor) {
      if (actor.key.split("-")[0] === "character") {
        if (actor.fontColorType === 0) {
          // プレイヤーと同じ色を使う
          color = this.getPeerActors[0].color;
        } else {
          color = actor.fontColor;
        }
      } else {
        color = actor.fontColor;
      }
    }

    // 括弧をつけるオプション
    let text = this.currentMessage;
    if (this.addBrackets) {
      text = `「${text}」`;
    }

    // 出力先タブ決定
    let outputTab = this.outputTab;
    if (outputTab === "[選択中]") {
      outputTab = this.activeTab;
    }

    let ownerKey = null;
    if (this.currentChatKey) {
      const kind = this.currentChatKey.split("-")[0];
      if (kind === "player") {
        ownerKey = this.playerKey;
      } else if (kind === "character") {
        ownerKey = this.getObj(this.currentChatKey).owner;
      } else {
        ownerKey = undefined;
      }
    } else {
      ownerKey = undefined;
    }

    const currentActor = this.getPeerActors.filter(
      (actor: any) => actor.key === this.chatActorKey
    )[0];

    const messageObj = {
      name: this.getViewName(this.currentChatKey),
      text: text,
      color: color,
      tab: outputTab,
      from: ownerKey,
      target: this.chatTarget,
      owner: currentActor ? currentActor.key : null
    };

    // -------------------
    // プレイヤー発言
    // -------------------
    this.addChatLog(messageObj);

    // -------------------
    // ダイスBot処理
    // -------------------
    const bcDice: any = this.$refs.diceBot.bcDice;
    if (bcDice) {
      bcDice.setMessage(this.currentMessage);
      const resultObj = bcDice.dice_command();
      const diceResult = resultObj[0].replace(/(^: )/g, "").replace(/＞/g, "→");
      const isSecret = resultObj[1];
      if (diceResult !== "1") {
        if (isSecret) {
          this.addChatLog({
            name: this.currentDiceBotSystem,
            text: `シークレットダイス`,
            color: "black",
            tab: this.activeTab,
            owner: "SYSTEM"
          });
        } else {
          this.addChatLog({
            name: this.currentDiceBotSystem,
            text: diceResult,
            color: "black",
            tab: this.activeTab,
            owner: "SYSTEM"
          });
        }
      }
      this.currentMessage = "";
    }
  }
  nameToKeyView(name: string): string {
    const key = this.nameToKey(name);
    this.updateActorKey(key);
    return key;
  }
  nameToKey(name: string): string {
    const obj = this.getPeerActors
      .map((actor: any) => ({
        name: this.getViewName(actor.key),
        key: actor.key
      }))
      .filter((obj: any) => obj.name === name)[0];
    return obj ? obj.key : "";
  }
  otherMatcherObj(tabObj: any): string {
    if (tabObj.isAll) return "";
    return this.tabMatchObj(tabObj).filter(
      (obj: any) => obj.key !== this.currentChatKey
    )[0];
  }
  tabMatchObj(tabObj: any): any {
    return tabObj.group.map((g: any) => this.getObj(g)).filter((obj: any) => {
      const kind = obj.key.split("-")[0];
      if (kind === "player") {
        if (obj.key === this.playerKey) return true;
      } else {
        if (obj.owner === this.playerKey) return true;
      }
      return false;
    });
  }

  @Watch("currentDiceBotSystem")
  onChangeCurrentDiceBotSystem(currentDiceBotSystem: any) {
    window.console.log(`ダイスボットシステムを${currentDiceBotSystem}に変更`);
  }

  @Watch("chatLogList")
  onChangeChatLogList(this: any, chatLogList: any) {
    setTimeout(function() {
      const elm = document.getElementById("chatLog");
      if (elm) {
        elm.scrollTop = elm.scrollHeight;
      }
    }, 0);
  }

  @Watch("inputting", { deep: true })
  onChangeInputting(this: any, inputting: any) {
    this.inputtingPeerIdList.splice(0, this.inputtingPeerIdList.length);
    for (const name in inputting) {
      if (!inputting.hasOwnProperty(name)) continue;
      if (inputting[name] > 0) {
        this.inputtingPeerIdList.push(name);
      }
    }
  }

  @Watch("secretTarget")
  onChangeSecretTarget(this: any, secretTarget: any) {
    if (!secretTarget) return;
    window.console.log("selectSecretTalk", secretTarget);
    this.secretTarget = "";
  }
  get chatOptionPageNum() {
    if (this.chatOptionSelectMode === "from") {
      const index = this.getPeerActors.findIndex(
        (target: any) => target.key === this.chatTarget
      );
      if (index === -1) return -1;
      return Math.floor(index / this.chatOptionPagingSize) + 1;
    }
    if (this.chatOptionSelectMode === "target") {
      const index = this.chatTargetList.findIndex(
        (target: any) => target.key === this.chatTarget
      );
      if (index === -1) return -1;
      return Math.floor(index / this.chatOptionPagingSize) + 1;
    }
    if (this.chatOptionSelectMode === "tab") {
      const index = this.chatTabList.findIndex(
        (target: any) => target.name === this.activeTab
      );
      if (index === -1) return -1;
      return Math.floor(index / this.chatOptionPagingSize) + 1;
    }
    return -1;
  }
  get chatOptionPageMaxNum() {
    let length: number = 0;
    if (this.chatOptionSelectMode === "from")
      length = this.getPeerActors.length;
    if (this.chatOptionSelectMode === "target")
      length = this.chatTargetList.length;
    if (this.chatOptionSelectMode === "tab") length = this.chatTabList.length;
    const result = Math.floor(length / this.chatOptionPagingSize) + 1;
    return result;
  }
  get chatOptionPagingList() {
    const pageNum = this.chatOptionPageNum;
    const startIndex = (pageNum - 1) * this.chatOptionPagingSize;
    if (this.chatOptionSelectMode === "from") {
      const endIndex = Math.min(
        pageNum * this.chatOptionPagingSize,
        this.getPeerActors.length
      );
      const result = this.getPeerActors.concat();
      return result.splice(startIndex, endIndex - startIndex);
    }
    if (this.chatOptionSelectMode === "target") {
      const endIndex = Math.min(
        pageNum * this.chatOptionPagingSize,
        this.chatTargetList.length
      );
      const result = this.chatTargetList.concat();
      return result.splice(startIndex, endIndex - startIndex);
    }
    if (this.chatOptionSelectMode === "tab") {
      const endIndex = Math.min(
        pageNum * this.chatOptionPagingSize,
        this.chatTabList.length
      );
      const result = this.chatTabList.concat();
      return result.splice(startIndex, endIndex - startIndex);
    }
    return 0;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  display: -webkit-box;
  display: -ms-flexbox;
  flex-direction: column;
  position: relative;
  overflow: visible;
}
.tabs {
  display: flex;
  padding-left: 1em;
  width: 100%;
  box-sizing: border-box;
}
.tab {
  position: relative;
  display: inline;
  /*font-size: 1em;*/
  background: linear-gradient(rgba(240, 240, 240, 1), rgba(0, 0, 0, 0.2));
  padding: 0.2em 0.7em;
  height: 2em;
  box-sizing: border-box;
  border: 1px solid gray;
  border-bottom: none;
  border-radius: 5px 5px 0 0;
  margin-right: -1px;
  margin-bottom: -1px;
  z-index: 10;
  white-space: nowrap;
  user-select: none;
  -ms-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  outline: none;
}
.tab.addButton {
  /*margin-right: 2em;*/
  cursor: pointer;
}
.tab.addButton:active,
.tab.active {
  background: white none;
}
.tab:hover {
  border-color: #0092ed;
  z-index: 100;
}
.tab.unRead {
  background-color: yellow;
}
#chatLog {
  display: block;
  background-color: white;
  flex: 1;
  -moz-box-flex: 1;
  -webkit-box-flex: 1;
  border: 1px solid gray;
  overflow-y: scroll;
  overflow-x: auto;
  margin: 0;
  padding-left: 2px;
  list-style: none;
  /*font-size: 13px;*/
  min-height: 70px;
  position: relative;
  z-index: 0;
  white-space: normal;
  word-break: break-all;
  -moz-user-select: text;
  -webkit-user-select: text;
  -ms-user-select: text;
}
.label {
  /*font-size: 10px;*/
  white-space: nowrap;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.oneLine {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: left;
  align-items: center;
  height: 26px;
  min-height: 26px;
  padding: 3px 0;
  vertical-align: middle;
}
.oneLine * {
  vertical-align: middle;
  padding: 2px;
}
.sendLine {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}
.sendLine .label {
  width: 100%;
  text-align: center;
}
.sendLine > * {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 42px;
  min-height: 42px;
}
.sendLine > div:not(.textAreaContainer) {
  margin-top: 2em;
}
.sendLine > div {
  flex-direction: column;
}
.sendLine .textAreaContainer {
  height: 100%;
  flex: 1;
  position: relative;
  display: flex;
}
.sendLine > div > *:not(.chatOptionSelector) {
  display: flex;
  justify-content: center;
  align-items: center;
}
.chatInputArea {
  flex: 1;
  display: flex;
  width: 100%;
  font-size: 13px;
}
.chatOption {
  display: flex;
  height: 3.6em;
  padding: 0.2em 0 0.2em 0.4em;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  border-radius: 5px 0 0 5px;
  border: 1px solid gray;
  border-right: 1px dashed gray;
  color: #999;
  background-color: white;
  cursor: default;
}
.chatOption * {
  width: 100%;
  height: 33%;
  display: flex;
  justify-content: left !important;
  align-items: center;
  padding-left: 0.2rem;
  padding-right: 0.4rem;
  border-radius: 5px 0 0 5px;
  font-size: 11px;
}
.chatOption .emphasis {
  color: black;
  font-weight: bold;
}
.diceBotSystem {
  margin-right: 10px;
}
textarea {
  resize: none;
  flex: 1;
  width: 100%;
  height: 3.6em;
  padding: 0.2em 0 0.2em 0.4em;
  font-size: inherit;
  line-height: 1.1em;
  /*border-radius: 0 5px 5px 0;*/
  border: 1px solid gray;
  border-left: none;
  outline: none;
}
textarea::placeholder {
  color: #999;
}
.inputtingArea {
  width: 100%;
  height: 20px;
  background-color: transparent;
  font-size: 10px;
}
.inputtingArea div {
  display: inline-flex;
  justify-content: left;
  align-items: center;
}
img {
  width: auto;
  height: auto;
  max-width: 20px;
  max-height: 20px;
  cursor: pointer;
  margin: 0 2px;
  border: solid rgba(0, 0, 0, 0) 1px;
}
img:hover {
  border-color: #0092ed;
}
span.icon {
  padding: 0;
  margin-right: 4px;
}
i[class^="icon-"] {
  border: 1px solid #777;
  border-radius: 50%;
  font-size: 12px;
  padding: 5px;
  background-color: white;
}
i[class^="icon-"]:hover {
  border-color: black;
}
i.icon-dice {
  color: rgb(0, 0, 150);
}
i.icon-font {
  color: rgb(150, 0, 150);
}
i.icon-music {
  color: rgb(0, 150, 150);
}
i.icon-dice:hover,
i.icon-dice.hover {
  background-color: rgb(0, 0, 150);
  color: white;
}
i.icon-font:hover,
i.icon-font.hover {
  background-color: rgb(150, 0, 150);
  color: white;
}
i.icon-music:hover,
i.icon-music.hover {
  background-color: rgb(0, 150, 150);
  color: white;
}

.dep {
  font-size: 11px;
}
.chatOptionSelector {
  padding: 0.5em;
  background-color: lightgreen;
  position: absolute;
  bottom: 100%;
  left: 0;
  user-select: none;
  -ms-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  cursor: default;
  z-index: 1000;
  max-height: 22.8em;
  overflow-y: auto;
}
.chatOptionSelector .ope {
  color: #777;
}
.chatOptionSelector > span {
  line-height: 1.8em;
}
.chatOptionSelector ul {
  padding: 0;
  margin: 0.5em 0 0;
  list-style: none;
}
.chatOptionSelector li {
  padding: 0.2em 0.8em;
  line-height: 1.6em;
}
.chatOptionSelector .selected {
  background-color: rgba(255, 255, 255, 0.8);
}
.bracketOption {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 1em;
}
</style>
