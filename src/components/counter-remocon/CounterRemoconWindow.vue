<template>
  <window-frame
    titleText="カウンターリモコン"
    display-property="private.display.counterRemoconWindow"
    align="center"
    baseSize="300, 180"
    ref="window"
  >
    <div class="contents" @contextmenu.prevent ref="contents" @click="contentsOnClick">

      <!-- ボタン表示エリア -->
      <div class="buttonArea">
        <label
          v-for="(infoObj, index) in publicCounterRemoconList"
          :key="index"
        >
          <button
            @click.left.stop="event => remoconButtonOnClick(infoObj, event)"
            @click.right.stop="event => openContext(event, infoObj.key)"
            @contextmenu.prevent
          >{{infoObj.buttonName}}</button>
        </label>
      </div>

      <!-- 操作エリア -->
      <div class="playOperationArea">
        <!-- セーブボタン -->
        <button
          class="save"
          @click="doSave"
        >セーブ</button>

        <!-- ロードボタン -->
        <button
          class="load"
          @click="doLoad"
        >ロード</button>

        <span style="flex: 1"></span>

        <!-- ボタン追加ボタン -->
        <button
          class="add"
          @click="doAdd"
        >ボタン追加</button>
      </div>
    </div>
    <div
      v-for="(selectBlock, blockIndex) in selectBlockList"
      :key="`block${blockIndex}`"
      :style="{ left: selectBlock.x, top: selectBlock.y }"
      class="selectBlock"
    >
      <span
        v-for="(item, itemIndex) in selectBlock.itemList"
        :key="`block${blockIndex}-item${itemIndex}`"
        @mouseenter="item.onMouse"
        @click="item.onClick"
        :style="{ left: item.x, top: item.y }"
        class="selectItem"
        :class="{ isEnd: selectBlock.isEnd }"
      >{{item.text}}</span>
    </div>
  </window-frame>
</template>

<script lang="ts">
import WindowMixin from "../WindowMixin.vue";
import WindowFrame from "../WindowFrame.vue";

import { Action, Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";
import { listDelete } from "@/components/common/Utility";

@Component({
  components: {
    WindowFrame
  }
})
export default class CounterRemoconWindow extends Mixins<WindowMixin>(
  WindowMixin
) {
  @Action("windowOpen") private windowOpen: any;
  @Action("addSimpleChatLog") private addSimpleChatLog: any;
  @Action("changeListInfo") private changeListInfo: any;
  @Action("sendBcdiceServer") private sendBcdiceServer: any;
  @Action("setProperty") private setProperty: any;
  @Getter("publicCounterRemoconList") private publicCounterRemoconList: any;
  @Getter("getMapObjectList") private getMapObjectList: any;
  @Getter("getObj") private getObj: any;
  @Getter("chatActorKey") private chatActorKey: any;
  @Getter("propertyList") private propertyList: any;

  private useCharacterList: any[] = [];
  private selectBlockList: any[] = [];

  doSave() {
    // TODO
  }

  doLoad() {
    // TODO
  }

  doAdd() {
    this.windowOpen("private.display.counterRemoconEditorWindow");
  }

  openContext(event: any, remoconKey: any): void {
    window.console.log("openContext", remoconKey);
    let pageX = event.pageX;
    let pageY = event.pageY;

    const contextProperty: string = "private.display.counterRemoconContext";

    const obj = {
      remoconKey,
      x: pageX,
      y: pageY
    };
    this.setProperty({
      property: contextProperty,
      value: obj,
      logOff: true
    }).then(() => this.windowOpen(contextProperty));
  }

  contentsOnClick() {
    window.console.log("contentsOnClick");
    // ブロックを初期化
    this.selectBlockList = [];
  }

  remoconButtonOnClick(remoconObj: any, event: any) {
    // ブロックを初期化
    this.selectBlockList = [];

    const doChange: Function = (value: string, character: any) => {
      window.console.log("doChange:", value, character, remoconObj);

      // 対象のプロパティを特定
      const counterName: string = remoconObj.counterName;
      const counterObj = this.propertyList.filter(
        (prop: any) => prop.property === counterName
      )[0];
      window.console.log(this.propertyList);
      let prop: string = counterObj.refStr;

      const commit: Function = (
        beforeValue: number,
        commitValue: number,
        command: string = ""
      ) => {
        window.console.log(remoconObj, this.COUNTER_REMOCON_TYPE.EQUALS);
        const isEquals: boolean =
          remoconObj.modifyType === this.COUNTER_REMOCON_TYPE.EQUALS;
        let afterValue = isEquals ? commitValue : beforeValue + commitValue;
        let modifyText: string = `${
          !isEquals && commitValue > 0 ? "+" : ""
        }${commitValue}`;
        if (command) {
          modifyText += `（${command}）`;
        }
        const text = remoconObj.message
          .replace("{0}", character.name)
          .replace("{1}", remoconObj.counterName)
          .replace("{2}", modifyText)
          .replace(
            "{3}",
            `（${remoconObj.counterName}：${beforeValue}->${afterValue}）`
          );
        this.addSimpleChatLog({
          text
        });

        // 実際にイニシアティブ表の値を更新
        const propertyObj: any = {};
        propertyObj[prop] = afterValue;
        this.changeListInfo({
          key: character.key,
          isNotice: true,
          property: propertyObj
        });

        // ブロックを初期化
        this.selectBlockList = [];
      };

      // ログに出力
      const beforeValue: number = parseInt(character.property[prop], 10);
      if (/^[0-9]+$/.test(value)) {
        commit(beforeValue, parseInt(value, 10));
      } else {
        this.sendBcdiceServer({
          system: "DiceBot",
          command: `${value}`
        }).then((json: any) => {
          window.console.log(json);
          if (json.ok) {
            const resultValue = json.result.replace(/^.+＞ /, "");
            window.console.log(resultValue);
            if (/^[0-9]+$/.test(resultValue)) {
              // bcdiceとして結果が取れ、かつ数値だった
              const matchResult = json.result.match(
                /^.+＞ ([^＞]+) ＞ [^＞]+$/
              );
              commit(
                beforeValue,
                parseInt(resultValue, 10),
                `${value}=${matchResult[1]}`
              );
              return;
            }
          }
          alert("実行結果で数値が取得できませんでした。\nキャンセルします。");
        });
      }
    };

    const addBlock: Function = (
      event: any,
      level: number,
      character: any = null,
      range: number[] | null = null
    ) => {
      if (remoconObj.target) {
        character = this.getObj(remoconObj.target);
      }

      const blockInfo: any = {
        onMouse: true
      };

      if (character) {
        // キャラクターが指定されている

        if (remoconObj.modifyValue) {
          // 変更する値も決まっている場合

          doChange(remoconObj.modifyValue, character);
          return;
        } else {
          // 変更する値は決まってない場合

          if (range) {
            // 範囲が指定されている場合
            blockInfo.isEnd = true;
            blockInfo.itemList = [];
            for (let i = range[0]; i <= range[1]; i++) {
              blockInfo.itemList.push({
                text: i > 0 ? `+${i}` : i,
                onMouse: (event: any, blockIndex: number) => {
                  blockInfo.onMouse = true;
                  if (blockIndex > 0)
                    this.selectBlockList[blockIndex - 1].onMouse = true;
                  window.console.log("onMouse-value:", i);
                },
                onClick: () => {
                  doChange(i, character);
                }
              });
            }
          } else {
            // 範囲が未指定の場合
            blockInfo.itemList = [];
            const diff = 10;
            const max = 99;
            for (let i = -90; i <= max; i += diff) {
              const text = `${i}〜${i + diff - 1}`;
              blockInfo.itemList.push({
                text: text,
                onMouse: (event: any) => {
                  window.console.log("onMouse-range:", [i, i + diff - 1]);
                  blockInfo.onMouse = true;
                  const first = this.selectBlockList[0];
                  first.onMouse = true;
                  addBlock(event, level + 1, character, [i, i + diff - 1]);
                },
                onClick: () => {}
              });
            }
          }
        }
      } else {
        if (remoconObj.modifyValue) {
          blockInfo.isEnd = true;
        }
        blockInfo.itemList = this.getMapObjectList({
          kind: "character",
          place: "field"
        }).map((character: any) => {
          const result: any = {
            text: character.name
          };

          if (remoconObj.modifyValue) {
            // 変更する値も決まっている場合
            result.onMouse = () => {};
            result.onClick = () => {
              doChange(remoconObj.modifyValue, character);
            };
          } else {
            // 変更する値は決まってない場合
            result.onMouse = (event: any) => {
              window.console.log("onMouse-character:", character.name);
              blockInfo.onMouse = true;
              addBlock(event, level + 1, character);
            };
            result.onClick = () => {};
          }

          return result;
        });
      }

      const contentsElm: HTMLDivElement = this.$refs.contents as HTMLDivElement;
      const relativeElm: HTMLDivElement = contentsElm.parentNode as HTMLDivElement;
      const relRect = relativeElm.getBoundingClientRect();
      const targetRect = event.target.getBoundingClientRect();
      blockInfo.x =
        targetRect.left + targetRect.width - relRect.left - 1 + "px";
      blockInfo.y = targetRect.top - relRect.top + 2 + "px";
      blockInfo.level = level;

      listDelete(this.selectBlockList, (item: any) => level <= item.level);
      this.selectBlockList.push(blockInfo);
      // window.console.log(this.selectBlockList, targetRect);
    };

    addBlock(event, 1);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.contents {
  position: absolute;
  height: 100%;
  width: 100%;
  font-size: 12px;
  display: flex;
  flex-direction: column;

  .playOperationArea {
    display: flex;
    flex-direction: row;

    button {
      font-size: 10px;
      padding: 1px 3px;
      min-width: 4em;
      box-sizing: content-box;

      &.save,
      &.load {
        margin-right: 1em;
      }
    }
  }

  .buttonArea {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    overflow-y: scroll;

    button {
      height: 3em;
      margin-right: 0.3em;
      margin-bottom: 0.3em;
    }
  }

  .operateArea {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
}

.selectBlock {
  position: absolute;
  background-color: white;
  display: flex;
  flex-direction: column;
  border: 1px solid lightgray;
}
.selectItem {
  min-width: 6em;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: lightblue;
  }

  &:not(.isEnd):after {
    content: "";
    display: inline-block;
    position: absolute;
    right: 0.5em;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0.3em 0 0.3em 0.42em;
    border-color: transparent transparent transparent #000000;
  }
}

button {
  border-radius: 0.5em;

  &:disabled {
    background-color: lightgrey;
  }
}
</style>
