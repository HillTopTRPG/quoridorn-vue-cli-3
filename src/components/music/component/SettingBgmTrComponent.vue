<template>
  <tr
    @click="selectLine(bgmObj.key)"
    :class="{ isActive: selectLineKey === bgmObj.key }"
    @dblclick="doDblClick"
  >
    <td :style="colStyle(0)" :title="linkageStr(bgmObj)" @contextmenu.prevent>
      {{ bgmObj.chatLinkage > 0 ? "あり" : "なし" }}
    </td>
    <divider :index="0" prop="settingBGMWindow" />
    <td :style="colStyle(1)" @contextmenu.prevent>
      {{ bgmObj.tag }}
    </td>
    <divider :index="1" prop="settingBGMWindow" />
    <td :style="colStyle(2)" @contextmenu.prevent>
      <i class="icon-stop2" v-if="!bgmObj.url"></i>
      <i class="icon-youtube2" v-if="isYoutube(bgmObj.url)"></i>
      <i class="icon-dropbox" v-if="isDropBox(bgmObj.url)"></i>
      <i
        class="icon-file-music"
        v-if="bgmObj.url && !isYoutube(bgmObj.url) && !isDropBox(bgmObj.url)"
      ></i>
    </td>
    <divider :index="2" prop="settingBGMWindow" />
    <td :style="colStyle(3)" class="selectable">
      {{ bgmObj.title }}
    </td>
    <divider :index="3" prop="settingBGMWindow" />
    <td :style="colStyle(4)" @contextmenu.prevent>
      {{ bgmObj.url ? convertSecond(bgmObj.start, bgmObj.end) : "-" }}
    </td>
    <divider :index="4" prop="settingBGMWindow" />
    <td :style="colStyle(5)" @contextmenu.prevent>
      <i class="icon-loop" v-if="bgmObj.url && bgmObj.isLoop"></i
      >{{ bgmObj.url && bgmObj.isLoop ? "" : "-" }}
    </td>
    <divider :index="5" prop="settingBGMWindow" />
    <td :style="colStyle(6)" @contextmenu.prevent>
      {{ bgmObj.url ? bgmObj.volume * 100 : "-" }}
    </td>
    <divider :index="6" prop="settingBGMWindow" />
    <td :style="colStyle(7)" :title="fadeTitle(bgmObj)" @contextmenu.prevent>
      {{ bgmObj.url ? fadeStr(bgmObj) : "-" }}
    </td>
  </tr>
</template>

<script lang="ts">
import Divider from "../../parts/Divider.vue";
import CtrlButton from "@/components/parts/CtrlButton.vue";

import { Action, Getter } from "vuex-class";
import { Component, Emit, Prop, Vue } from "vue-property-decorator";

@Component({ components: { CtrlButton, Divider } })
export default class SettingBgmTrComponent extends Vue {
  @Action("setProperty") setProperty: any;
  @Action("windowOpen") windowOpen: any;
  @Action("addListObj") addListObj: any;
  @Action("deleteListObj") deleteListObj: any;
  @Action("moveListObj") moveListObj: any;
  @Getter("bgmList") bgmList: any;
  @Getter("isGameMaster") private isGameMaster: any;
  @Getter("magicWord") private magicWord: any;
  @Getter("encrypt") encrypt: any;

  @Prop({ type: Object, required: true })
  private bgmObj!: any;

  @Prop({ type: String, required: true })
  private windowParam!: string;

  @Emit("dblclick")
  private doDblClick() {}

  private isYoutube(url: string) {
    return /www\.youtube\.com/.test(url);
  }

  private isDropBox(url: string) {
    return /dropbox/.test(url);
  }

  private selectLine(bgmKey: string): void {
    this.setProperty({
      property: `private.display.${this.windowParam}.selectLineKey`,
      value: bgmKey,
      logOff: true
    });
  }

  private get convertSecond(): Function {
    return (start: number, end: number): string => {
      if (start && end) return `${start}〜${end}`;
      if (start) return `${start}〜`;
      if (end) return `〜${end}`;
      return "All";
    };
  }

  /* Start 列幅可変テーブルのプロパティ */
  private get selectLineKey(): string {
    return this.$store.state.private.display[this.windowParam].selectLineKey;
  }

  private get widthList(): number[] {
    return this.$store.state.private.display[this.windowParam].widthList;
  }

  private get movingIndex(): number {
    return this.$store.state.private.display[this.windowParam].movingIndex;
  }

  private get startX(): number {
    return this.$store.state.private.display[this.windowParam].startX;
  }

  private get startLeftWidth(): number {
    return this.$store.state.private.display[this.windowParam].startLeftWidth;
  }

  private get startRightWidth(): number {
    return this.$store.state.private.display[this.windowParam].startRightWidth;
  }

  private get colStyle(): any {
    return (index: number) => ({ width: `${this.widthList[index]}px` });
  }
  /* End 列幅可変テーブルのプロパティ */

  private get fadeStr(): Function {
    return (bgmObj: any): string => {
      if (bgmObj.fadeIn > 0 && bgmObj.fadeOut > 0) return "in/out";
      if (bgmObj.fadeIn > 0 && bgmObj.fadeOut === 0) return "in";
      if (bgmObj.fadeIn === 0 && bgmObj.fadeOut > 0) return "out";
      return "-";
    };
  }

  private get fadeTitle(): Function {
    return (bgmObj: any): string => {
      if (bgmObj.fadeIn > 0 && bgmObj.fadeOut > 0)
        return `in:${bgmObj.fadeIn}\nout:${bgmObj.fadeOut}`;
      if (bgmObj.fadeIn > 0 && bgmObj.fadeOut === 0)
        return `in:${bgmObj.fadeIn}`;
      if (bgmObj.fadeIn === 0 && bgmObj.fadeOut > 0)
        return `out:${bgmObj.fadeOut}`;
      return "-";
    };
  }

  private get linkageStr(): Function {
    return (bgmObj: any): string => {
      if (bgmObj.chatLinkage === 1)
        return `【末尾文字】\n${bgmObj.chatLinkageSearch}`;
      if (bgmObj.chatLinkage === 2)
        return `【正規表現】\n${bgmObj.chatLinkageSearch}`;
      return "なし";
    };
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

  > div {
    display: flex;
    flex-direction: row;

    > .space {
      display: block;
      flex: 1;
    }
  }
}
button {
  font-size: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.playOperationArea {
  margin-bottom: 5px;

  button {
    margin-bottom: 5px;
  }
}

.operateArea {
  display: flex;
  margin-top: 5px;
  text-align: center;

  > * {
    margin-right: 0.5em;

    &:last-child {
      margin-right: 0;
    }
  }

  > .space {
    flex: 1;
  }
}
/* Start 列幅可変テーブルのCSS */
.tableContainer {
  overflow-y: scroll;
  flex: 1;
  width: 100%;
  height: 216px;
  border: 1px solid rgb(183, 186, 188);
  font-size: 8px;
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
  background-size: 4em 4em;

  td {
    &.dev {
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

    i {
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

  tbody {
    height: 100%;

    tr {
      height: 2em;

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

    td {
      text-align: center;
    }
  }

  thead {
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
}
/* End 列幅可変テーブルのCSS */
.comment {
  font-size: 10px;
  font-weight: bold;
  color: red;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-file-music {
  font-size: 1.5em;
}
</style>
