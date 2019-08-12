<template>
  <window-frame
    titleText="チャット"
    display-property="private.display.chatWindow"
    align="left-bottom"
    baseSize="-300, 300"
    :fontSizeBar="true"
    @globalEnter="globalEnter"
  >
    <div class="container">
      <!----------------
       ! チャットログ
       !--------------->
      <chat-log-viewer
        :tabIndex="0"
        :chatLogList="chatLogList"
        :tabList="chatTabs"
        :activeChatTab="activeChatTab"
        :hoverChatTab="hoverChatTab"
        :isVertical="isChatTabVertical"
        :isViewTime="isViewTime"
        :isViewTotalTab="isViewTotalTab"
        :textFunc="
          info => (info.isTotal ? info.name : `#${info.name}/${info.unRead}`)
        "
        @onSelect="chatTabOnSelect"
        @onHover="chatTabOnHover"
        @editTab="tabAddButtonOnClick"
        :colorMap="colorMap"
        :viewOption="true"
      />

      <!----------------
       ! 操作盤
       !--------------->
      <div class="oneLine dep" @contextmenu.prevent>
        <!-- 発言者選択 -->
        <span class="label">名前(！)</span>
        <ctrl-select
          :tabindex="isModal ? -1 : chatTabs.length + 2"
          :value="chatActorKey"
          @input="updateActorKey"
          title=""
          :optionInfoList="
            getSelfActors.map(actor => ({
              key: actor.key,
              value: actor.key,
              text: getViewName(actor.key)
            }))
          "
          :disabled="isModal"
        />

        <!-- ステータス選択 -->
        <actor-status-select
          :actorKey="chatActorKey"
          v-model="statusName"
          :tabindex="isModal ? -1 : chatTabs.length + 3"
          :disabled="isModal"
        />

        <!-- ダイスボット選択 -->
        <dice-bot-select
          ref="diceBot"
          v-model="currentDiceBotSystem"
          :tabindex="isModal ? -1 : chatTabs.length + 4"
          class="diceBotSystem"
          :disabled="isModal"
        />

        <!-- ここから各種機能呼び出しボタン -->
        <span class="icon">
          <i
            class="icon-dice"
            title="ダイスボットの追加・編集・削除"
            @click="diceBotSettingButtonOnClick"
            @keydown.space.stop="diceBotSettingButtonOnClick"
            @keydown.enter.stop="diceBotSettingButtonOnClick"
            :tabindex="isModal ? -1 : chatTabs.length + 5"
          ></i>
        </span>
        <span class="icon">
          <i
            class="icon-bin"
            title="チャットログ全削除"
            @click="chatLogDeleteButtonOnClick"
            @keydown.space.stop="chatLogDeleteButtonOnClick"
            @keydown.enter.stop="chatLogDeleteButtonOnClick"
            :tabindex="isModal ? -1 : chatTabs.length + 6"
          ></i>
        </span>
        <span class="icon">
          <i
            class="icon-file-text"
            title="チャットログ保存"
            @click="chatLogExportButtonOnClick"
            @keydown.space.stop="chatLogExportButtonOnClick"
            @keydown.enter.stop="chatLogExportButtonOnClick"
            :tabindex="isModal ? -1 : chatTabs.length + 7"
          ></i>
        </span>
        <span class="icon">
          <i
            class="icon-cloud-check"
            title="点呼・投票設定"
            @click="rollCallSettingButtonOnClick"
            @keydown.space.stop="rollCallSettingButtonOnClick"
            @keydown.enter.stop="rollCallSettingButtonOnClick"
            :tabindex="isModal ? -1 : chatTabs.length + 8"
          ></i>
        </span>
        <span class="icon">
          <i
            class="icon-bell"
            title="目覚ましアラーム設定"
            @click="alermSettingButtonOnClick"
            @keydown.space.stop="alermSettingButtonOnClick"
            @keydown.enter.stop="alermSettingButtonOnClick"
            :tabindex="isModal ? -1 : chatTabs.length + 9"
          ></i>
        </span>
        <span class="icon">
          <i
            class="icon-music"
            title="BGMの設定"
            @click="bgmSettingButtonOnClick"
            @keydown.space.stop="bgmSettingButtonOnClick"
            @keydown.enter.stop="bgmSettingButtonOnClick"
            :tabindex="isModal ? -1 : chatTabs.length + 10"
          ></i>
        </span>
        <span class="icon">
          <i
            class="icon-film"
            title="カットイン設定"
            @click="cutInSettingButtonOnClick"
            @keydown.space.stop="cutInSettingButtonOnClick"
            @keydown.enter.stop="cutInSettingButtonOnClick"
            :tabindex="isModal ? -1 : chatTabs.length + 11"
          ></i>
        </span>
        <span class="icon">
          <i
            class="icon-list2"
            title="チャットパレット設定"
            @click="chatPaletteSettingButtonOnClick"
            @keydown.space.stop="chatPaletteSettingButtonOnClick"
            @keydown.enter.stop="chatPaletteSettingButtonOnClick"
            :tabindex="isModal ? -1 : chatTabs.length + 12"
          ></i>
        </span>
        <span class="icon">
          <i
            class="icon-accessibility"
            title="立ち絵設定"
            @click="standImageSettingButtonOnClick"
            @keydown.space.stop="standImageSettingButtonOnClick"
            @keydown.enter.stop="standImageSettingButtonOnClick"
            :tabindex="isModal ? -1 : chatTabs.length + 13"
          ></i>
        </span>
        <span class="icon">
          <i
            class="icon-target"
            title="射界設定"
            @click="rangeSettingButtonOnClick"
            @keydown.space.stop="rangeSettingButtonOnClick"
            @keydown.enter.stop="rangeSettingButtonOnClick"
            :tabindex="isModal ? -1 : chatTabs.length + 14"
          ></i>
        </span>
      </div>

      <!----------------
       ! 発言
       !--------------->
      <div class="sendLine dep">
        <div class="textAreaContainer">
          <!----------------
           ! グループチャットタブ
           !--------------->
          <tabs-component
            class="group"
            :tabIndex="chatTabs.length + 14"
            :tabList="groupTargetTabListFiltered"
            :activeChatTab="chatTarget"
            :hoverChatTab="hoverChatTargetTab"
            :isVertical="isTargetTabVertical"
            :textFunc="
              info =>
                `${info.name}${
                  otherMatcherObj(info)
                    ? `(${getViewName(otherMatcherObj(info).key)})`
                    : ''
                }`
            "
            @onSelect="groupTargetTabOnSelect"
            @onHover="groupTargetTabOnHover"
            @editTab="targetTabAddButtonOnClick"
            :viewOption="true"
          >
            <!-- 「」付与チェックボックス -->
            <label class="bracketOption">
              <input
                type="checkbox"
                v-model="addBrackets"
                :tabindex="
                  isModal ? -1 : chatTabs.length + chatTabs.length + 16
                "
                :disabled="isModal"
                @keydown.enter.stop
                @keyup.enter.stop
              />
              発言時に「」を付与
            </label>
          </tabs-component>

          <!----------------
           ! チャットオプション（単位）
           !--------------->
          <div
            class="optionTable dep"
            v-if="unitList.length"
            @contextmenu.prevent
          >
            <table>
              <tr v-for="unit in unitList" :key="unit.unit">
                <th>{{ unit.name }}</th>
                <th>({{ unit.unit }})</th>
                <td>{{ unit.value }}</td>
              </tr>
            </table>
          </div>

          <!----------------
           ! チャットオプション（送信者）
           !--------------->
          <div
            class="chatOptionSelector dep"
            v-if="chatOptionSelectMode === 'from'"
            @contextmenu.prevent
          >
            <span
              >送信者{{
                chatOptionPageMaxNum > 1
                  ? ` (${chatOptionPageNum} / ${chatOptionPageMaxNum})`
                  : ""
              }}</span
            >
            <ul>
              <li
                class="ope"
                v-if="chatOptionPageMaxNum > 1 && chatOptionPageNum === 1"
              >
                [末尾へ]
              </li>
              <li
                class="ope"
                v-if="chatOptionPageMaxNum > 1 && chatOptionPageNum !== 1"
              >
                [前へ]
              </li>
              <li
                v-for="actor in chatOptionPagingList"
                :key="actor.name"
                :class="{
                  selected:
                    actor.key === chatActorKey &&
                    actor.statusName === statusName
                }"
                tabindex="-1"
              >
                {{ actor.name }}
              </li>
              <li
                class="ope"
                v-if="
                  chatOptionPageMaxNum > 1 &&
                    chatOptionPageNum !== chatOptionPageMaxNum
                "
              >
                [次へ]
              </li>
              <li
                class="ope"
                v-if="
                  chatOptionPageMaxNum > 1 &&
                    chatOptionPageNum === chatOptionPageMaxNum
                "
              >
                [先頭へ]
              </li>
            </ul>
          </div>

          <!----------------
           ! チャットオプション（対象）
           !--------------->
          <div
            class="chatOptionSelector dep"
            v-if="chatOptionSelectMode === 'target'"
            @contextmenu.prevent
          >
            <span
              >送信先{{
                chatOptionPageMaxNum > 1
                  ? ` (${chatOptionPageNum} / ${chatOptionPageMaxNum})`
                  : ""
              }}</span
            >
            <ul>
              <li
                class="ope"
                v-if="chatOptionPageMaxNum > 1 && chatOptionPageNum === 1"
              >
                [末尾へ]
              </li>
              <li
                class="ope"
                v-if="chatOptionPageMaxNum > 1 && chatOptionPageNum !== 1"
              >
                [前へ]
              </li>
              <li
                v-for="target in chatOptionPagingList"
                :key="target.key"
                :class="{ selected: chatTarget === target.key }"
                tabindex="-1"
              >
                {{ getViewName(target.key) }}
              </li>
              <li
                class="ope"
                v-if="
                  chatOptionPageMaxNum > 1 &&
                    chatOptionPageNum !== chatOptionPageMaxNum
                "
              >
                [次へ]
              </li>
              <li
                class="ope"
                v-if="
                  chatOptionPageMaxNum > 1 &&
                    chatOptionPageNum === chatOptionPageMaxNum
                "
              >
                [先頭へ]
              </li>
            </ul>
          </div>

          <!----------------
           ! チャットオプション（タブ）
           !--------------->
          <div
            class="chatOptionSelector dep"
            v-if="chatOptionSelectMode === 'tab'"
            @contextmenu.prevent
          >
            <span
              >出力先のタブ{{
                chatOptionPageMaxNum > 1
                  ? ` (${chatOptionPageNum} / ${chatOptionPageMaxNum})`
                  : ""
              }}</span
            >
            <ul>
              <li
                class="ope"
                v-if="chatOptionPageMaxNum > 1 && chatOptionPageNum === 1"
              >
                [末尾へ]
              </li>
              <li
                class="ope"
                v-if="chatOptionPageMaxNum > 1 && chatOptionPageNum !== 1"
              >
                [前へ]
              </li>
              <li
                v-for="tab in chatOptionPagingList"
                :key="tab.key"
                :class="{ selected: outputTab === tab.key }"
                tabindex="-1"
              >
                {{ tab.name }}
              </li>
              <li
                class="ope"
                v-if="
                  chatOptionPageMaxNum > 1 &&
                    chatOptionPageNum !== chatOptionPageMaxNum
                "
              >
                [次へ]
              </li>
              <li
                class="ope"
                v-if="
                  chatOptionPageMaxNum > 1 &&
                    chatOptionPageNum === chatOptionPageMaxNum
                "
              >
                [先頭へ]
              </li>
            </ul>
          </div>

          <!----------------
           ! チャットオプション（対象）
           !--------------->
          <div
            class="chatOptionSelector dep"
            v-if="chatOptionSelectMode === 'chatFormat'"
            @contextmenu.prevent
          >
            <span
              >以降の文字を…{{
                chatOptionPageMaxNum > 1
                  ? ` (${chatOptionPageNum} / ${chatOptionPageMaxNum})`
                  : ""
              }}</span
            >
            <ul>
              <li
                class="ope"
                v-if="chatOptionPageMaxNum > 1 && chatOptionPageNum === 1"
              >
                [末尾へ]
              </li>
              <li
                class="ope"
                v-if="chatOptionPageMaxNum > 1 && chatOptionPageNum !== 1"
              >
                [前へ]
              </li>
              <li
                v-for="target in chatOptionPagingList"
                :key="target.label"
                :class="{ selected: partsFormat === target.label }"
                tabindex="-1"
              >
                {{ target.label }}
              </li>
              <li
                class="ope"
                v-if="
                  chatOptionPageMaxNum > 1 &&
                    chatOptionPageNum !== chatOptionPageMaxNum
                "
              >
                [次へ]
              </li>
              <li
                class="ope"
                v-if="
                  chatOptionPageMaxNum > 1 &&
                    chatOptionPageNum === chatOptionPageMaxNum
                "
              >
                [先頭へ]
              </li>
            </ul>
          </div>

          <!-- チャット入力エリア -->
          <label class="chatInputArea">
            <span
              class="chatOption"
              @click="chatOptionOnClick"
              @contextmenu.prevent
            >
              <span class="emphasis"
                >! {{ getViewName(chatActorKey) }}-{{ statusName }}</span
              >
              <span :class="{ emphasis: chatTarget !== 'groupTargetTab-0' }"
                >> {{ groupTargetName }}</span
              >
              <span :class="{ emphasis: outputTab !== null }"
                ># {{ outputTab ? getTabName(outputTab) : "[選択中]" }}</span
              >
            </span>
            <!----------------
             ! 入力欄
             !--------------->
            <textarea
              id="chatTextArea"
              v-model="currentMessage"
              @input="onInput"
              @blur="textAreaOnBlur"
              @keydown.up.self.stop="
                event => chatOptionSelectChange('up', event)
              "
              @keydown.down.self.stop="
                event => chatOptionSelectChange('down', event)
              "
              @keydown.esc.prevent="textAreaOnPressEsc"
              @keypress.enter.prevent="event => sendMessage(event, true)"
              @keyup.enter.prevent="event => sendMessage(event, false)"
              :tabindex="isModal ? -1 : chatTabs.length + chatTabs.length + 17"
              :placeholder="placeholderText"
              :disabled="isModal"
              ref="input"
            ></textarea>
          </label>
        </div>
        <ctrl-button
          :tabindex="isModal ? -1 : chatTabs.length + chatTabs.length + 18"
          @contextmenu.prevent
          @click="sendMessage(null, true)"
          :disabled="isModal"
          >送信</ctrl-button
        >
      </div>
      <!----------------
       ! 入力者表示
       !--------------->
      <div class="inputtingArea dep" @contextmenu.prevent>
        <div v-for="name in inputtingPeerIdList" :key="name">
          <img
            alt=""
            v-show="inputtingPeerIdList.length > 0"
            :src="require('../../assets/inputting.gif')"
          />
          {{ createInputtingMsg(name) }}
        </div>
      </div>
    </div>
  </window-frame>
</template>

<script lang="ts">
import WindowMixin from "../WindowMixin.vue";
import WindowFrame from "../WindowFrame.vue";

import DiceBotSelect from "../parts/select/DiceBotSelect.vue";
import ActorStatusSelect from "@/components/parts/select/ActorStatusSelect.vue";
import CtrlSelect from "@/components/parts/CtrlSelect.vue";
import CtrlButton from "@/components/parts/CtrlButton.vue";

import { Watch } from "vue-property-decorator";
import { Action, Getter, Mutation } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";
import TabsComponent from "@/components/parts/tab-component/TabsComponent.vue";
import { conversion } from "@/components/common/Utility";
import ChatLogViewer from "@/components/chat/ChatLogViewer.vue";

@Component({
  components: {
    ChatLogViewer,
    TabsComponent,
    CtrlButton,
    CtrlSelect,
    ActorStatusSelect,
    WindowFrame,
    DiceBotSelect
  }
})
export default class ChatWindow extends Mixins<WindowMixin>(WindowMixin) {
  @Action("windowOpen") private windowOpen: any;
  @Action("setProperty") private setProperty: any;
  @Action("sendRoomData") private sendRoomData: any;
  @Action("sendBcdiceServer") private sendBcdiceServer: any;
  @Action("updateActorKey") private updateActorKey: any;
  @Action("sendChatLog") private sendChatLog: any;
  @Action("saveChatLogHtml") private saveChatLogHtml: any;
  @Action("deleteChatLog") private deleteChatLog: any;
  @Mutation("chatTabSelect") private chatTabSelect: any;
  @Getter("getSelfActors") private getSelfActors: any;
  @Getter("getViewName") private getViewName: any;
  @Getter("getObj") private getObj: any;
  @Getter("chatLogList") private chatLogList: any;
  @Getter("chatTabs") private chatTabs: any;
  @Getter("playerList") private playerList: any;
  @Getter("groupTargetTabListFiltered") private groupTargetTabListFiltered: any;
  @Getter("members") private members: any;
  @Getter("inputting") private inputting: any;
  @Getter("createInputtingMsg") private createInputtingMsg: any;
  @Getter("chatTargetList") private chatTargetList: any;
  @Getter("activeChatTab") private activeChatTab: any;
  @Getter("hoverChatTab") private hoverChatTab: any;
  @Getter("hoverTab") private hoverTab: any;
  @Getter("playerKey") private playerKey: any;
  @Getter("chatOptionPagingSize") private chatOptionPagingSize: any;
  @Getter("isWait") private isWait: any;
  @Getter("chatActorKey") private chatActorKey: any;
  @Getter("roomSystem") private roomSystem: any;
  @Getter("customDiceBotList") private customDiceBotList: any;
  @Getter("customDiceBotRoomSysList") private customDiceBotRoomSysList: any;
  @Getter("loadYaml") private loadYaml: any;
  @Getter("isChatTabVertical") private isChatTabVertical: any;
  @Getter("colorMap") private colorMap: any;
  @Getter("chatFormats") private chatFormats: any;
  @Getter("isViewTime") private isViewTime: any;
  @Getter("isViewTotalTab") private isViewTotalTab: any;
  @Getter("isModal") private isModal: any;

  /** Enterを押しているかどうか */
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
  private outputTab: string | null = null;
  /** 選択されているシステム */
  private currentDiceBotSystem: string = "DiceBot";
  /** 秘匿チャットの相手 */
  private secretTarget: string = "";
  /** 入力中のルームメンバーのpeerIdの配列 */
  private inputtingPeerIdList: any[] = [];

  private unitList: any = [];
  private partsFormat: string = "";

  private volatileFrom: string = "";
  private volatileStatusName: string = "";
  private volatileTarget: string = "";
  private volatileActiveTab: string = "";
  private volatileTargetTab: string | null = "";
  private statusName: string = "◆";
  private hoverChatTargetTab = "";

  private placeholderText: string =
    'メッセージ（改行はShift + Enter）\n部分フォント変更は "&" を入力';

  private globalEnter() {
    window.console.log("globalEnter at ChatWindow");
    const input: HTMLTextAreaElement = this.$refs.input as HTMLTextAreaElement;
    input.focus();
  }

  @Watch("chatActorKey", { deep: true, immediate: true })
  private onChangeChatActorKey(chatActorKey: any) {
    const actor: any = this.getObj(chatActorKey);
    if (!actor) return;
    const status: any = actor.statusList.filter(
      (status: any) => status.name === this.statusName
    )[0];
    if (!status) {
      this.statusName = "◆";
    }
  }

  /**
   * チャット入力欄の入力イベントハンドラ
   * @param event イベント
   */
  private onInput(event: any): void {
    const text = event.target.value;

    // コマンド（発言者選択）
    let selectFrom: string = "";
    if (text.startsWith("!") || text.startsWith("！")) {
      const useText = text.substring(1);
      if (useText.length === 0) {
        selectFrom = this.chatActorKey;
      }
      this.getSelfActors.forEach((target: any) => {
        if (selectFrom) return;
        if (this.getViewName(target.key).startsWith(useText)) {
          selectFrom = target.key;
        }
      });
    }

    // コマンド（グループチャット選択）
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

    // コマンド（タブ選択）
    let selectTab: string | null | undefined = undefined;
    if (text.startsWith("#") || text.startsWith("＃")) {
      const useText = text.substring(1);
      if (useText.length === 0) {
        selectTab = this.outputTab;
      }
      const selection: any[] = [
        { name: "[選択中]", key: null },
        ...this.chatTabs
      ];
      selection.forEach(({ key, name }: { key: string; name: string }) => {
        if (selectTab !== undefined) return;
        if (name.startsWith(useText)) selectTab = key;
      });
    }

    // コマンド（部分フォーマット）
    let partsFormat: string = "";
    if (text.endsWith("&") || text.endsWith("＆")) {
      partsFormat = this.partsFormat || this.chatFormats[0].label;
    }

    if (selectFrom) {
      this.chatOptionSelectMode = "from";
      this.updateActorKey(selectFrom);
    } else if (selectTarget) {
      this.chatOptionSelectMode = "target";
      this.chatTarget = selectTarget;
    } else if (selectTab !== undefined) {
      this.chatOptionSelectMode = "tab";
      this.outputTab = selectTab;
    } else if (partsFormat) {
      this.chatOptionSelectMode = "chatFormat";
      this.partsFormat = partsFormat;
    } else {
      this.chatOptionSelectMode = "";
      this.sendRoomData({
        type: "NOTICE_INPUT",
        value: { key: this.chatActorKey, target: this.chatTarget },
        isWait: this.isWait
      });
    }

    const matchResult = text.match(/([-.０-９0-9]+) *(.+)/);
    if (matchResult) {
      const num: number = parseFloat(
        matchResult[1].replace(/[０-９]/g, (s: string) =>
          String.fromCharCode(s.charCodeAt(0) - 0xfee0)
        )
      );
      const unit: string = matchResult[2];

      // window.console.log(num, unit, matchResult);

      const result: any[] = conversion(num, unit);
      if (result) {
        this.unitList = result;
        return;
      }
    }
    this.unitList = [];
  }

  /**
   * 現在のチャット送信対象
   */
  private get groupTargetName(): string | null {
    let target = this.getObj(this.chatTarget);
    return target ? this.getViewName(target.key) : null;
  }

  /**
   * 上下キーを押下されてチャットオプションの選択項目を移動させる処理
   */
  private chatOptionSelectChange(direction: string, event: any): void {
    // 変化前の値を保存
    if (!this.volatileFrom) this.volatileFrom = this.chatActorKey;
    if (!this.volatileStatusName) this.volatileStatusName = this.statusName;
    if (!this.volatileTarget) this.volatileTarget = this.chatTarget;
    if (!this.volatileActiveTab) this.volatileActiveTab = this.activeChatTab;
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
      let index = this.useCommandActorList.findIndex(
        (s: any) =>
          s.key === this.chatActorKey && s.statusName === this.statusName
      );
      const newValue = arrangeIndex(this.useCommandActorList, index);

      this.statusName = newValue.statusName;
      this.updateActorKey(newValue.key);
      event.preventDefault();
    }

    // 発言先の選択の場合
    if (this.chatOptionSelectMode === "target") {
      event.preventDefault();
      let index = this.chatTargetList.findIndex(
        (s: any) => s.key === this.chatTarget
      );
      const newValue = arrangeIndex(this.chatTargetList, index);

      this.groupTargetTabOnSelect(newValue.key);
      event.preventDefault();
    }

    // タブの選択の場合
    if (this.chatOptionSelectMode === "tab") {
      const selection: (null | any)[] = [
        null, // [選択中]
        ...this.chatTabs.map((tab: any) => tab.key)
      ];

      event.preventDefault();
      let index = selection.indexOf(this.outputTab);
      const newValue = arrangeIndex(selection, index);

      this.chatTabOnSelect(
        newValue !== null ? newValue : this.volatileActiveTab
      );
      this.outputTab = newValue;
      event.preventDefault();
    }

    // チャットフォーマットの選択の場合
    if (this.chatOptionSelectMode === "chatFormat") {
      const selection: (null | any)[] = [
        ...this.chatFormats.map((chatFormat: any) => chatFormat.label)
      ];

      event.preventDefault();
      let index = selection.indexOf(this.partsFormat);
      const newValue = arrangeIndex(selection, index);
      this.partsFormat = newValue;
      event.preventDefault();
    }
  }

  /**
   * 入力欄からフォーカスが外れた場合
   */
  private textAreaOnBlur(): void {
    this.resetChatOption();
  }

  /**
   * 入力欄でESCキーを押下した場合
   */
  private textAreaOnPressEsc(): void {
    this.resetChatOption();
  }

  /**
   * チャットオプションを仮変更前の状態に戻す
   */
  private resetChatOption(): void {
    if (this.chatOptionSelectMode) {
      if (this.chatOptionSelectMode === "chatFormat") {
        this.currentMessage = this.currentMessage.replace(/[&＆]$/, "");
      } else {
        this.currentMessage = "";
      }
      if (this.volatileFrom) {
        this.updateActorKey(this.volatileFrom);
      }
      if (this.volatileStatusName) {
        // window.console.log(this.statusName, "->", this.volatileStatusName);
        this.statusName = this.volatileStatusName;
      }
      if (this.volatileTarget) this.chatTarget = this.volatileTarget;
      if (this.volatileActiveTab) this.chatTabOnSelect(this.volatileActiveTab);
      if (this.volatileTargetTab) this.outputTab = this.volatileTargetTab;
    }
    this.chatOptionSelectMode = "";
    this.volatileFrom = "";
    this.volatileTarget = "";
    this.volatileStatusName = "";
    this.volatileActiveTab = "";
    this.volatileTargetTab = "";
  }

  /**
   * チャットログ表示タブを選択されたときの挙動
   * @param key タブのkey
   */
  private chatTabOnSelect(key: string): void {
    this.setProperty({
      property: "chat.activeChatTab",
      value: key,
      logOff: true
    });
    this.chatTabSelect(key);
  }

  /**
   * チャットログ表示タブをホバーされたときの挙動
   * @param key タブのkey
   */
  private chatTabOnHover(key: string): void {
    this.setProperty({
      property: "chat.hoverChatTab",
      value: key,
      logOff: true
    });
  }

  /**
   * グループターゲットタブを選択された時の挙動
   * @param targetKey タブのkey
   */
  private groupTargetTabOnSelect(targetKey: string): void {
    this.chatTarget = targetKey;

    if (targetKey.split("-")[0] === "groupTargetTab") {
      const tabObj = this.getObj(this.chatTarget);
      if (tabObj.targetTab) this.outputTab = tabObj.targetTab;
      const otherObj: any = this.otherMatcherObj(tabObj);
      if (otherObj) {
        this.updateActorKey(otherObj.key);
      }
    }
  }

  private groupTargetTabOnHover(targetKey: string): void {
    this.hoverChatTargetTab = targetKey;
  }

  /**
   * チャットオプションクリックイベントハンドラ
   */
  private chatOptionOnClick(): void {
    document.getElementById("chatTextArea")!.focus();
  }

  /**
   * チャットタブ追加ボタンクリックイベントハンドラ
   */
  private tabAddButtonOnClick(): void {
    this.windowOpen("private.display.settingChatTabWindow");
  }

  /**
   * グループチャットタグ追加ボタンクリックイベントハンドラ
   */
  private targetTabAddButtonOnClick(): void {
    this.windowOpen("private.display.settingChatTargetTabWindow");
  }

  /**
   * ダイスボット管理ボタンクリックイベントハンドラ
   */
  private diceBotSettingButtonOnClick(): void {
    this.windowOpen("private.display.customDiceBotTableWindow");
  }

  /**
   * チャットログ削除ボタンクリックイベントハンドラ
   */
  private async chatLogDeleteButtonOnClick(): Promise<any> {
    const result: boolean = window.confirm(
      "本当にチャットログを削除しますか？\n削除前にログ保存を同時に行います。"
    );
    if (!result) return;

    await this.saveChatLogHtml();
    this.deleteChatLog();
  }

  /**
   * チャットログ保存ボタンクリックイベントハンドラ
   */
  private chatLogExportButtonOnClick(): void {
    this.saveChatLogHtml();
  }

  /**
   * 点呼・投票設定ボタンクリックイベントハンドラ
   */
  private rollCallSettingButtonOnClick(): void {
    // TODO
    alert("未実装です。");
  }

  /**
   * 目覚ましアラーム設定ボタンクリックイベントハンドラ
   */
  private alermSettingButtonOnClick(): void {
    // TODO
    alert("未実装です。");
  }

  /**
   * BGM設定ボタンクリックイベントハンドラ
   */
  private bgmSettingButtonOnClick(): void {
    this.windowOpen("private.display.settingBGMWindow");
  }

  /**
   * カットイン設定ボタンクリックイベントハンドラ
   */
  private cutInSettingButtonOnClick(): void {
    // TODO
    alert("未実装です。");
  }

  /**
   * チャットパレット設定ボタンクリックイベントハンドラ
   */
  private chatPaletteSettingButtonOnClick(): void {
    this.windowOpen("private.display.chatPaletteSettingWindow");
  }

  /**
   * 立ち絵設定ボタンクリックイベントハンドラ
   */
  private standImageSettingButtonOnClick(): void {
    this.windowOpen("private.display.standImageSettingWindow");
  }

  /**
   * 射界設定ボタンクリックイベントハンドラ
   */
  private rangeSettingButtonOnClick(): void {
    // TODO
    alert("未実装です。");
  }

  /**
   * チャットオプションに表示するチャットタブの表示名の取得
   * @param tabKey
   */
  private getTabName(tabKey: string): string {
    const tab = this.chatTabs.filter((tab: any) => tab.key === tabKey)[0];
    return tab ? tab.name : null;
  }

  /**
   * チャット欄に記入された内容をチャットに反映させる
   * @param event イベント
   * @param flg 押下ならtrue, 離す場合はfalse
   */
  private sendMessage(this: any, event: any, flg: boolean): void {
    if (this.enterPressing === flg) return;
    this.enterPressing = flg;
    if (!flg) return;
    if (event && event.shiftKey) {
      const textArea: HTMLTextAreaElement = event.target as HTMLTextAreaElement;
      const sentence = textArea.value;
      const pos = textArea.selectionStart;

      const before = sentence.substr(0, pos);
      const after = sentence.substr(pos, sentence.length);
      this.currentMessage = `${before}\n${after}`;
      setTimeout(() => {
        textArea.selectionStart = pos + 1;
        textArea.selectionEnd = pos + 1;
      });
      return;
    }
    if (this.currentMessage === "") return;

    // 単位を初期化
    this.unitList = [];

    // チャット送信オプション選択中のEnterは特別仕様
    if (this.chatOptionSelectMode) {
      if (this.chatOptionSelectMode === "chatFormat") {
        const chatFormat: any = this.chatFormats.filter(
          (format: any) => format.label === this.partsFormat
        )[0];
        this.currentMessage =
          this.currentMessage.replace(/[&＆]$/, "") + chatFormat.chatText;
        this.partsFormat = this.chatFormats[0].label;
      } else {
        this.currentMessage = "";
      }
      this.chatOptionSelectMode = "";
      this.volatileFrom = "";
      this.volatileStatusName = "";
      this.volatileTarget = "";
      this.volatileActiveTab = "";
      this.volatileTargetTab = "";
      return;
    }

    // 括弧をつけるオプション
    let text = this.currentMessage;
    if (this.addBrackets) {
      text = `「${text}」`;
    }
    this.currentMessage = "";

    this.sendChatLog({
      actorKey: this.chatActorKey,
      text,
      outputTab: this.outputTab,
      statusName: this.statusName,
      chatTarget: this.chatTarget,
      currentDiceBotSystem: this.currentDiceBotSystem
    });
  }

  /**
   * グループチャットタブの発言者の名前を取得する
   * @param tabObj グループチャットオブジェクト
   */
  private otherMatcherObj(tabObj: any): string {
    if (tabObj.isAll) return "";
    return tabObj.group
      .map((g: any) => this.getObj(g))
      .filter((obj: any) => {
        const kind = obj.key.split("-")[0];
        if (kind === "player") {
          if (obj.key === this.playerKey) return true;
        } else {
          if (obj.owner === this.playerKey) return true;
        }
        return false;
      })
      .filter((obj: any) => obj.key !== this.chatActorKey)[0];
  }

  @Watch("groupTargetTabListFiltered", { deep: true })
  private onChangeGroupTargetTabListFiltered(
    groupTargetTabListFiltered: any[]
  ) {
    const chatTarget = groupTargetTabListFiltered.filter(
      (tabObj: any) => tabObj.key === this.chatTarget
    )[0];
    if (!chatTarget) this.chatTarget = "groupTargetTab-0";
  }

  @Watch("roomSystem")
  private onChangeRoomSystem(roomSystem: string) {
    this.currentDiceBotSystem = roomSystem;
    const path = `/static/conf/system/${roomSystem}/customDiceBot.yaml`;
    this.loadYaml(path)
      .then((customDiceBotList: any[]) => {
        // 読み込めた場合
        customDiceBotList.forEach((customDiceBot: any, index: number) => {
          customDiceBot.key = `customDiceBotRoomSys-${index}`;
          customDiceBot.diceBotSystem = roomSystem;
          const tableContents: any = customDiceBot!.tableContents;
          const tableContentsArr = [];
          for (const prop in tableContents) {
            if (!tableContents.hasOwnProperty(prop)) continue;
            tableContentsArr.push(`${prop}:${tableContents[prop]}`);
          }
          customDiceBot.tableContents = tableContentsArr.join("\n");
        });
        this.setProperty({
          property: "public.customDiceBot.roomSysList",
          value: customDiceBotList,
          isNotice: true,
          logOff: true
        });
      })
      .catch((err: any) => {
        // window.console.log(err);
        // 初期化
        this.setProperty({
          property: "public.customDiceBot.roomSysList",
          value: [],
          isNotice: true,
          logOff: true
        });
      });
  }

  @Watch("currentDiceBotSystem")
  private onChangeCurrentDiceBotSystem(currentDiceBotSystem: any) {
    window.console.log(`ダイスボットシステムを${currentDiceBotSystem}に変更`);
  }

  @Watch("chatLogList")
  private onChangeChatLogList(this: any, chatLogList: any) {
    setTimeout(function() {
      const elm = document.getElementById("chatLog");
      if (elm) {
        elm.scrollTop = elm.scrollHeight;
      }
    }, 0);
  }

  @Watch("inputting", { deep: true })
  private onChangeInputting(this: any, inputting: any) {
    this.inputtingPeerIdList.splice(0, this.inputtingPeerIdList.length);
    for (const name in inputting) {
      if (!inputting.hasOwnProperty(name)) continue;
      if (inputting[name] > 0) {
        this.inputtingPeerIdList.push(name);
      }
    }
  }

  @Watch("secretTarget")
  private onChangeSecretTarget(this: any, secretTarget: any) {
    if (!secretTarget) return;
    // window.console.log("selectSecretTalk", secretTarget);
    this.secretTarget = "";
  }

  private get useCommandActorList(): any[] {
    const resultList: any[] = [];
    this.getSelfActors.forEach((actor: any) => {
      const statusList: any[] = actor.statusList;
      statusList.forEach((status: any) => {
        resultList.push({
          key: actor.key,
          statusName: status.name,
          name: `${this.getViewName(actor.key)}-${status.name}`
        });
      });
    });
    return resultList;
  }

  private get chatOptionPageNum() {
    let index: number = -1;
    if (this.chatOptionSelectMode === "from") {
      index = this.useCommandActorList.findIndex(
        (target: any) =>
          target.key === this.chatActorKey &&
          target.statusName === this.statusName
      );
    }
    if (this.chatOptionSelectMode === "target") {
      index = this.chatTargetList.findIndex(
        (target: any) => target.key === this.chatTarget
      );
    }
    if (this.chatOptionSelectMode === "tab") {
      const list = this.chatTabs.map((tab: any) => ({ key: tab.name }));
      list.unshift({ key: null });
      index = list.findIndex(
        (target: any) => target.key === this.activeChatTab
      );
    }
    if (this.chatOptionSelectMode === "chatFormat") {
      const list = this.chatFormats.map((chatFormat: any) => ({
        label: chatFormat.label
      }));
      index = list.findIndex(
        (target: any) => target.label === this.partsFormat
      );
    }
    if (index === -1) return -1;
    return Math.floor(index / this.chatOptionPagingSize) + 1;
  }

  private get chatOptionPageMaxNum() {
    let length: number = 0;
    if (this.chatOptionSelectMode === "from")
      length = this.useCommandActorList.length;
    if (this.chatOptionSelectMode === "target")
      length = this.chatTargetList.length;
    if (this.chatOptionSelectMode === "tab") length = this.chatTabs.length;
    if (this.chatOptionSelectMode === "chatFormat")
      length = this.chatFormats.length;
    if (length === 0) return 1;
    return Math.floor((length - 1) / this.chatOptionPagingSize) + 1;
  }

  private get chatOptionPagingList() {
    const pageNum = this.chatOptionPageNum;
    const startIndex = (pageNum - 1) * this.chatOptionPagingSize;
    let list: any[] = [];
    if (this.chatOptionSelectMode === "from") {
      list = this.useCommandActorList.concat();
    }
    if (this.chatOptionSelectMode === "target") {
      list = this.chatTargetList.concat();
    }
    if (this.chatOptionSelectMode === "tab") {
      list = this.chatTabs.concat();
      list.unshift({ name: "[選択中]", key: null });
    }
    if (this.chatOptionSelectMode === "chatFormat") {
      list = this.chatFormats.concat();
    }
    const endIndex = Math.min(pageNum * this.chatOptionPagingSize, list.length);
    return list.splice(startIndex, endIndex - startIndex);
  }

  private get isTargetTabVertical() {
    return this.$store.state.private.display.settingChatTargetTabWindow
      .isTabVertical;
  }
}
</script>

<style scoped lang="scss">
@import "../common";

.container {
  @include flex-box(column, normal, normal);
  width: 100%;
  height: 100%;
  position: relative;
  overflow: visible;
}

.tabs.group {
  margin-left: 0.5em;
}

.oneLine {
  @include flex-box(row, flex-start, center);
  flex-wrap: nowrap;
  height: 26px;
  min-height: 26px;
  padding: 3px 0;
  vertical-align: middle;

  * {
    vertical-align: middle;
    padding: 2px;
  }
}

.sendLine {
  @include flex-box(row, center, center);

  .label {
    width: 100%;
    text-align: center;
  }

  > *:not(.tabs) {
    @include flex-box(row, flex-end, center);
    height: 42px;
    min-height: 42px;
  }

  > div:not(.tabs) {
    flex-direction: column;

    &:not(.textAreaContainer) {
      margin-top: 2em;
    }
  }
}

.sendLine .textAreaContainer {
  height: 100%;
  flex: 1;
  position: relative;
  display: flex;
}

.chatInputArea {
  flex: 1;
  display: flex;
  width: 100%;
  font-size: 13px;
  position: relative;
  z-index: 10;
}

.chatOption {
  @include flex-box(column, flex-start, center);
  height: 3.6em;
  padding: 0.2em 0 0.2em 0.4em;
  border-radius: 5px 0 0 5px;
  border: 1px solid gray;
  border-right: 1px dashed gray;
  color: #999;
  background-color: white;
  cursor: default;

  * {
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

  &::placeholder {
    color: #999;
  }
}

.inputtingArea {
  width: 100%;
  height: 20px;
  background-color: transparent;
  font-size: 10px;

  div {
    @include inline-flex-box(row, flex-start, center);
  }
}

img {
  width: auto;
  height: auto;
  max-width: 20px;
  max-height: 20px;
  cursor: pointer;
  margin: 0 2px;
  border: solid rgba(0, 0, 0, 0) 1px;

  &:hover {
    border-color: #0092ed;
  }
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

  &:hover {
    border-color: black;
    color: white;
  }
}

i.icon-dice {
  color: rgb(0, 0, 150);
  &:hover,
  &.hover {
    background-color: rgb(0, 0, 150);
  }
}

i.icon-bin {
  color: rgb(150, 150, 150);
  &:hover,
  &.hover {
    background-color: rgb(150, 150, 150);
  }
}

i.icon-file-text {
  color: rgb(150, 150, 150);
  &:hover,
  &.hover {
    background-color: rgb(150, 150, 150);
  }
}

i.icon-cloud-check,
i.icon-bell {
  color: rgb(150, 150, 0);
  &:hover,
  &.hover {
    background-color: rgb(150, 150, 0);
  }
}

i.icon-music,
i.icon-film {
  color: rgb(0, 150, 150);
  &:hover,
  &.hover {
    background-color: rgb(0, 150, 150);
  }
}

i.icon-list2,
i.icon-accessibility,
i.icon-target {
  color: rgb(150, 0, 150);
  &:hover,
  &.hover {
    background-color: rgb(150, 0, 150);
  }
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
  cursor: default;
  z-index: 1000;
  max-height: 22.8em;
  overflow-y: auto;

  .ope {
    color: #777;
  }

  > span {
    line-height: 1.8em;
  }

  ul {
    padding: 0;
    margin: 0.5em 0 0;
    list-style: none;
  }

  li {
    padding: 0.2em 0.8em;
    line-height: 1.6em;
  }

  .selected {
    background-color: rgba(255, 255, 255, 0.8);
  }
}

.optionTable {
  padding: 0.5em;
  background-color: lightgreen;
  position: absolute;
  bottom: 100%;
  left: 0;
  cursor: default;
  z-index: 1000;
  max-height: 26em;
  overflow-y: auto;

  table {
    padding: 0;
    margin: 0;
    border-collapse: collapse;
  }

  tr:first-child {
    th,
    td {
      border-top-color: transparent;
    }
  }

  th,
  td {
    padding: 0;
    line-height: 2em;
    text-align: left;
    vertical-align: center;
    border-top: dashed 1px black;
  }
}

.bracketOption {
  flex: 1;
  @include flex-box(row, flex-end, center);
  padding-right: 3em;
}
</style>
