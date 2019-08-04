<template>
  <window-frame
    titleText="グループチャット編集画面"
    display-property="private.display.editGroupChatWindow"
    align="center"
    :fixSize="`${windowSize.w}, ${windowSize.h}`"
    @open="initWindow"
    @reset="initWindow"
  >
    <div class="contents" @contextmenu.prevent>
      <div class="scrollArea">
        <div>
          <label>
            秘匿チャット<input type="checkbox" v-model="isSecret" />
          </label>
          <label>名前<input type="text" v-model="name"/></label>
          <label>
            出力先のタブ
            <ctrl-select
              v-model="targetTab"
              :optionInfoList="targetTabOptionInfoList"
              :maxWidth="11"
            />
          </label>
          <label>全体<input type="checkbox" v-model="isAll"/></label>
        </div>
        <div class="tableContainer">
          <table @mousemove="event => moveDev(event)" @mouseup="moveDevEnd">
            <thead>
              <tr>
                <th :style="colStyle(0)">対象</th>
                <divider :index="0" prop="editGroupChatWindow" />
                <th :style="colStyle(1)">名前</th>
              </tr>
            </thead>
            <tbody>
              <!-- ===============================================================
                コンテンツ
              -->
              <tr
                v-for="target in targetList"
                :key="target.key"
                @click="selectLine(target.key)"
                :class="{ isActive: selectLineKey === target.key }"
              >
                <!-- 対象チェック -->
                <td :style="colStyle(0)" class="target">
                  <input
                    type="checkbox"
                    :checked="isContain(target.key)"
                    @change="
                      event =>
                        changeTargetCheck(target.key, event.target.checked)
                    "
                    @click.stop
                    :disabled="isAll"
                  />
                </td>
                <divider :index="0" prop="editGroupChatWindow" />

                <!-- 名前 -->
                <td :style="colStyle(1)" class="name" :class="target.kind">
                  {{ getViewName(target.key) }}
                </td>
              </tr>
              <tr class="space">
                <td :style="colStyle(0)"></td>
                <divider :index="0" prop="editGroupChatWindow" />
                <td :style="colStyle(1)"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="buttonArea">
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
import Divider from "../parts/Divider.vue";
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
    Divider
  }
})
export default class EditGroupChatWindow extends Mixins<WindowMixin>(
  WindowMixin
) {
  @Action("windowClose") private windowClose: any;
  @Action("windowOpen") private windowOpen: any;
  @Action("setProperty") private setProperty: any;
  @Getter("getViewName") private getViewName: any;
  @Getter("chatTabs") private chatTabs: any;
  @Getter("playerList") private playerList: any;
  @Getter("getMapObjectList") private getMapObjectList: any;
  @Getter("groupTargetTabList") private groupTargetTabList: any;

  private isSecret: boolean = false;
  private name: string = "";
  private targetTab: string = "";
  private isAll: boolean = false;
  private group: any[] = [];

  private initWindow() {
    this.isSecret = this.storeObj.isSecret;
    this.name = this.storeObj.name;
    this.targetTab = this.storeObj.targetTab;
    this.isAll = this.storeObj.isAll;
    this.group = this.storeObj.group.concat();
  }

  private commit() {
    const tab = this.groupTargetTabList.filter(
      (tab: any) => tab.key === this.objKey
    )[0];
    const index = this.groupTargetTabList.indexOf(tab);
    this.setProperty({
      property: `public.chat.groupTargetTab.list.${index}`,
      value: {
        isSecret: this.isSecret,
        name: this.name,
        targetTab: this.targetTab,
        isAll: this.isAll,
        group: this.group
      },
      isNotice: true,
      logOff: true
    });
    this.windowClose("private.display.editGroupChatWindow");
  }

  private cancel() {
    this.windowClose("private.display.editGroupChatWindow");
  }

  private moveDev(event: any) {
    if (this.movingIndex > -1) {
      const diff = event.clientX - this.startX;
      const afterLeftWidth = this.startLeftWidth + diff;
      const afterRightWidth = this.startRightWidth - diff;
      if (afterLeftWidth >= 10 && afterRightWidth >= 10) {
        const paramObj: any = {};
        paramObj[this.movingIndex] = afterLeftWidth;
        paramObj[this.movingIndex + 1] = afterRightWidth;
        this.setProperty({
          property: "private.display.editGroupChatWindow.widthList",
          value: paramObj,
          logOff: true
        });
      }
    }
  }

  private moveDevEnd() {
    this.setProperty({
      property: "private.display.editGroupChatWindow",
      value: {
        hoverDevIndex: -1,
        movingIndex: -1,
        startX: -1,
        startLeftWidth: -1,
        startRightWidth: -1
      },
      logOff: true
    });
  }

  private selectLine(selectLineKey: string) {
    this.setProperty({
      property: "private.display.editGroupChatWindow.selectLineKey",
      value: selectLineKey,
      logOff: true
    });
    if (!this.isAll) {
      this.changeTargetCheck(selectLineKey, !this.isContain(selectLineKey));
    }
  }

  private isSelected(groupTargetTab: any, player: any) {
    return !!groupTargetTab.group.filter((t: string) => t === player.key)[0];
  }

  private changeProp(groupTargetTab: any, prop: string, newValue: any) {
    const target = this.groupTargetTabList.filter(
      (tab: any) => tab.key === groupTargetTab.key
    )[0];
    if (!target) return;
    const index = this.groupTargetTabList.indexOf(target);

    const value: any = {};
    value[prop] = newValue;
    if (prop === "isAll" && newValue) {
      value.group = [];
    }

    this.setProperty({
      property: `public.chat.groupTargetTab.list.${index}`,
      value: value,
      isNotice: true,
      logOff: true
    });
  }

  private changeGroupTargetMember(
    groupTargetTab: any,
    player: any,
    flg: boolean
  ) {
    const newArr = groupTargetTab.group.concat();
    if (flg) {
      // 追加の場合
      newArr.push(player.key);
    } else {
      // 除外の場合
      const index = groupTargetTab.group.indexOf(player.key);
      newArr.splice(index, 1);
    }
    this.changeProp(groupTargetTab, "group", newArr);
  }

  private getViewNames(tab: any) {
    return tab.isAll
      ? "全員"
      : tab.group.map((g: string) => this.getViewName(g)).join(", ");
  }

  private changeTargetCheck(key: string, value: boolean) {
    if (value) {
      this.group.push(key);
    } else {
      const index = this.group.indexOf(key);
      this.group.splice(index, 1);
    }
  }

  private isContain(key: string) {
    return this.group.filter(g => g === key)[0];
  }

  @Watch("isAll")
  private onChangeIsAll(isAll: boolean) {
    if (isAll) {
      this.group.splice(0, this.group.length);
    }
  }

  private get objKey() {
    return this.$store.state.private.display["editGroupChatWindow"].key;
  }

  private get storeObj() {
    return this.groupTargetTabList.filter(
      (tab: any) => tab.key === this.objKey
    )[0];
  }

  /* Start 列幅可変テーブルのプロパティ */
  private get selectLineKey() {
    return this.$store.state.private.display.editGroupChatWindow.selectLineKey;
  }

  private get widthList() {
    return this.$store.state.private.display.editGroupChatWindow.widthList;
  }

  private get movingIndex() {
    return this.$store.state.private.display.editGroupChatWindow.movingIndex;
  }

  private get startX() {
    return this.$store.state.private.display.editGroupChatWindow.startX;
  }

  private get startLeftWidth() {
    return this.$store.state.private.display.editGroupChatWindow.startLeftWidth;
  }

  private get startRightWidth() {
    return this.$store.state.private.display.editGroupChatWindow
      .startRightWidth;
  }

  private get colStyle() {
    return (index: number) => ({ width: `${this.widthList[index]}px` });
  }
  /* End 列幅可変テーブルのプロパティ */

  private get windowSize() {
    return this.$store.state.private.display.editGroupChatWindow.windowSize;
  }

  private get targetList() {
    const result: any[] = [];
    this.playerList.forEach((player: any) => {
      result.push(player);
      // 破壊的に追加
      result.push.apply(
        result,
        this.getMapObjectList({
          kind: "character",
          place: "field",
          playerKey: player.key
        })
      );
    });
    return result;
  }

  private get targetTabOptionInfoList(): any[] {
    const resultList: any[] = this.chatTabs
      .filter((tab: any) => !tab.isTotal)
      .map((tabObj: any) => ({
        key: tabObj.name,
        value: tabObj.key,
        text: tabObj.name,
        disabled: false
      }));
    resultList.unshift({
      key: "0",
      value: "",
      text: "指定なし",
      disabled: false
    });
    return resultList;
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
}

.scrollArea {
  flex: 1;
  overflow-y: scroll;
}

.buttonArea {
  display: flex;
  justify-content: center;
  align-content: flex-start;
}

label {
  display: flex;
  align-items: center;
  margin-top: 5px;

  input[type="text"] {
    flex: 1;
    margin-left: 5px;
  }
}

/* Start 列幅可変テーブルのCSS */
.tableContainer {
  flex: 1;
  width: 100%;
  /*height: 216px;*/
  border: 1px solid rgb(183, 186, 188);
  font-size: 8px;
  box-sizing: border-box;
}

table {
  width: calc(100% - 19px);
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
  background-image: linear-gradient(
    0deg,
    white 0%,
    white 50%,
    rgb(247, 247, 247) 51%,
    rgb(247, 247, 247) 100%
  );
  background-size: 4em 4em;

  input {
    background: none;
    border: none;
  }

  select {
    width: 100%;
    height: 100%;
    background: none;
    border: none;
  }

  td.dev {
    background-color: rgb(183, 186, 188);
    cursor: col-resize;
    position: relative;
    width: 1px;

    &:after {
      position: absolute;
      height: 100%;
      top: 0;
      left: -2px;
      content: "";
      width: 5px;
    }
  }

  td i {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

tr {
  height: 2em;

  &.space {
    height: auto;
  }
}

th,
td {
  padding: 0;
  white-space: nowrap;
  cursor: default;
}

th,
td:not(.divider) {
  overflow: hidden;
}

table tbody {
  height: 100%;

  tr {
    height: 2em;

    &:not(.space).isActive {
      background-color: rgb(127, 206, 255) !important;
    }
  }

  td {
    &.target {
      text-align: center;
    }

    &.name {
      text-align: left;
      padding-left: 0.5em;

      &.character {
        padding-left: 1.5em;
      }
    }
  }
}

table thead {
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 1) 0%,
    rgba(234, 234, 234, 1) 100%
  );

  tr {
    border-bottom: 1px solid rgb(183, 186, 188);

    th:hover {
      background: rgb(178, 225, 255);
    }

    &:not(.space) {
      &:nth-child(odd):hover {
        background: rgb(178, 225, 255);
      }

      &:nth-child(even):hover {
        background: rgb(178, 225, 255);
      }
    }
  }
}
/* End 列幅可変テーブルのCSS */
</style>
