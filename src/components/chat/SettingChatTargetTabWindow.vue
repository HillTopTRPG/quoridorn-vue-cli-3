<template>
  <window-frame
    titleText="グループチャット設定画面"
    display-property="private.display.settingChatTargetTabWindow"
    align="center"
    :fixSize="`${windowSize.w}, ${windowSize.h}`"
  >
    <div class="contents" @contextmenu.prevent>
      <div class="operationArea">
        <ctrl-button @click="addButtonOnClick">追加</ctrl-button>
        <ctrl-button @click="delButtonOnClick">削除</ctrl-button>
        <div class="space"></div>
        <label>
          タブを斜めにする<input type="checkbox" v-model="isTabVertical" />
        </label>
      </div>
      <div class="tableContainer">
        <table @mousemove="event => moveDev(event)" @mouseup="moveDevEnd">
          <thead>
            <tr>
              <th :style="colStyle(0)">秘匿</th>
              <divider :index="0" prop="settingChatTargetTabWindow" />
              <th :style="colStyle(1)">名前</th>
              <divider :index="1" prop="settingChatTargetTabWindow" />
              <th :style="colStyle(2)">出力先タブ</th>
              <divider :index="2" prop="settingChatTargetTabWindow" />
              <th :style="colStyle(3)">送信先</th>
              <divider :index="3" prop="settingChatTargetTabWindow" />
              <th :style="colStyle(4)"></th>
            </tr>
          </thead>
          <tbody>
            <!-- ===============================================================
              コンテンツ
            -->
            <tr
              v-for="groupTargetTab in groupTargetTabList"
              :key="groupTargetTab.key"
              @click="selectLine(groupTargetTab.key)"
              :class="{ isActive: selectLineKey === groupTargetTab.key }"
            >
              <!-- 秘匿チェック -->
              <td :style="colStyle(0)">
                <span
                  class="icon-checkmark"
                  v-if="groupTargetTab.isSecret"
                ></span>
              </td>
              <divider :index="0" prop="settingChatTargetTabWindow" />

              <!-- 名前 -->
              <td :style="colStyle(1)">
                {{ groupTargetTab.name }}
              </td>
              <divider :index="1" prop="settingChatTargetTabWindow" />

              <!-- 出力先タブ -->
              <td :style="colStyle(2)">
                {{
                  groupTargetTab.targetTab
                    ? groupTargetTab.targetTab
                    : "指定なし"
                }}
              </td>
              <divider :index="2" prop="settingChatTargetTabWindow" />

              <!-- 送信先 -->
              <td
                :style="colStyle(3)"
                style="text-align: left; padding: 0 0.3rem;"
              >
                {{ getViewNames(groupTargetTab) }}
              </td>
              <divider :index="2" prop="settingChatTargetTabWindow" />

              <!-- 編集ボタン -->
              <td :style="colStyle(4)">
                <ctrl-button
                  @click="edit(groupTargetTab.key)"
                  :disabled="!isEditableTab(groupTargetTab.key)"
                >
                  編集
                </ctrl-button>
              </td>
            </tr>
            <tr class="space">
              <td :style="colStyle(0)"></td>
              <divider :index="0" prop="settingChatTargetTabWindow" />
              <td :style="colStyle(1)"></td>
              <divider :index="1" prop="settingChatTargetTabWindow" />
              <td :style="colStyle(2)"></td>
              <divider :index="2" prop="settingChatTargetTabWindow" />
              <td :style="colStyle(3)"></td>
              <divider :index="3" prop="settingChatTargetTabWindow" />
              <td :style="colStyle(4)"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </window-frame>
</template>

<script lang="ts">
import WindowFrame from "../WindowFrame.vue";
import WindowMixin from "../WindowMixin.vue";
import Divider from "../parts/Divider.vue";
import CtrlButton from "@/components/parts/CtrlButton.vue";

import { Action, Getter, Mutation } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({
  components: {
    CtrlButton,
    WindowFrame,
    Divider
  }
})
export default class SettingChatTargetTabWindow extends Mixins<WindowMixin>(
  WindowMixin
) {
  @Action("windowClose") private windowClose: any;
  @Action("windowOpen") private windowOpen: any;
  @Action("setProperty") private setProperty: any;
  @Action("addGroupTargetTab") private addGroupTargetTab: any;
  @Action("deleteGroupTargetTab") private deleteGroupTargetTab: any;
  @Getter("getSelfActors") private getSelfActors: any;
  @Getter("getViewName") private getViewName: any;
  @Getter("getObj") private getObj: any;
  @Getter("playerKey") private playerKey: any;
  @Getter("chatActorKey") private chatActorKey: any;
  @Getter("isChatTabVertical") private isChatTabVertical: any;
  @Getter("groupTargetTabList") private groupTargetTabList: any;
  @Getter("getMapObjectList") private getMapObjectList: any;

  private isEditableTab(key: string): boolean {
    if (key === "groupTargetTab-0") return false;

    const tabObj: any = this.groupTargetTabList.find(
      (tabObj: any) => tabObj.key === key
    );

    const playerKey: string = this.playerKey;
    const fieldCharacters: any[] = this.getMapObjectList({
      kind: "character",
      place: "field",
      playerKey
    });

    const actor = tabObj.group.filter(
      (g: any) =>
        g === playerKey ||
        fieldCharacters.findIndex((c: any) => c.key === g) >= 0
    )[0];

    return actor;
  }

  private addButtonOnClick() {
    this.addGroupTargetTab({ ownerKey: this.getChatFromKey() }).then(() => {
      const last: any = this.groupTargetTabList[
        this.groupTargetTabList.length - 1
      ];
      this.selectLine(last.key);
      this.edit(last.key);
    });
  }

  private delButtonOnClick() {
    if (this.selectLineKey) {
      this.deleteGroupTargetTab({ key: this.selectLineKey });
    } else {
      alert("削除対象を選択してください。");
    }
  }

  private edit(key: string) {
    this.setProperty({
      property: "private.display.editGroupChatWindow.key",
      value: key,
      logOff: true
    });
    this.windowOpen("private.display.editGroupChatWindow");
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
          property: "private.display.settingChatTargetTabWindow.widthList",
          value: paramObj,
          logOff: true
        });
      }
    }
  }

  private moveDevEnd() {
    this.setProperty({
      property: "private.display.settingChatTargetTabWindow",
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
      property: "private.display.settingChatTargetTabWindow.selectLineKey",
      value: selectLineKey,
      logOff: true
    });
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

  private getChatFromKey() {
    const actor: any = this.getSelfActors.filter(
      (actor: any) => actor.key === this.chatActorKey
    )[0];
    return actor ? actor.key : "";
  }

  private getViewNames(tab: any) {
    return tab.isAll
      ? "全員"
      : tab.group.map((g: string) => this.getViewName(g)).join(", ");
  }

  /* Start 列幅可変テーブルのプロパティ */
  private get selectLineKey() {
    return this.$store.state.private.display.settingChatTargetTabWindow
      .selectLineKey;
  }

  private get widthList() {
    return this.$store.state.private.display.settingChatTargetTabWindow
      .widthList;
  }

  private get movingIndex() {
    return this.$store.state.private.display.settingChatTargetTabWindow
      .movingIndex;
  }

  private get startX() {
    return this.$store.state.private.display.settingChatTargetTabWindow.startX;
  }

  private get startLeftWidth() {
    return this.$store.state.private.display.settingChatTargetTabWindow
      .startLeftWidth;
  }

  private get startRightWidth() {
    return this.$store.state.private.display.settingChatTargetTabWindow
      .startRightWidth;
  }

  private get colStyle() {
    return (index: number) => ({ width: `${this.widthList[index]}px` });
  }
  /* End 列幅可変テーブルのプロパティ */

  private get windowSize() {
    return this.$store.state.private.display.settingChatTargetTabWindow
      .windowSize;
  }

  private get isTabVertical() {
    return this.isChatTabVertical;
  }
  private set isTabVertical(flg: boolean) {
    this.setProperty({
      property: `private.display.settingChatTargetTabWindow.isTabVertical`,
      value: flg,
      logOff: true
    });
  }
}
</script>

<style scoped lang="scss">
@import "../common.scss";

.contents {
  @include flex-box(column, normal, normal);
  position: absolute;
  height: 100%;
  width: 100%;
  font-size: 12px;
}

.operationArea {
  @include flex-box(row, normal, normal);

  .space {
    flex: 1;
  }

  label {
    display: flex;
  }
}

.operateArea {
  margin-top: 5px;
  text-align: center;
}

/* Start 列幅可変テーブルのCSS */
.tableContainer {
  overflow-y: scroll;
  flex: 1;
  width: 100%;
  height: 216px;
  border: 1px solid rgb(183, 186, 188);
  font-size: 10px;
  box-sizing: border-box;
}

table {
  width: calc(100% - 19px);
  height: 100%;
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
  background-size: 5em 5em;
}

tr {
  height: 2.5em;

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

  td {
    text-align: center;
  }

  tr {
    height: 2.5em;

    &:not(.space) {
      &.isActive {
        background-color: rgb(127, 206, 255) !important;
      }

      &:nth-child(odd):hover {
        background: rgb(178, 225, 255);
      }

      &:nth-child(even):hover {
        background: rgb(178, 225, 255);
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
  }
}

table td.dev {
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

button {
  /*height: 2.5em;*/
  font-size: inherit;
  box-sizing: border-box;
  border-radius: 3px;
  padding: 0.3em 0.5em;
  line-height: 1em;

  &:disabled {
    background-color: lightgrey;
  }
}
/* End 列幅可変テーブルのCSS */
</style>
