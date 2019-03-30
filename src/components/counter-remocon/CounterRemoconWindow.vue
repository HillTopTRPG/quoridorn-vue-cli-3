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
            @click.right="event => openContext(event, infoObj.key)"
            @contextmenu.prevent
          >{{infoObj.buttonName}}</button>
        </label>
      </div>

      <!-- 操作エリア -->
      <div class="playOperationArea">
        <!-- セーブボタン -->
        <button
          class="save"
          @click="saveButtonOnClick"
        >セーブ</button>

        <!-- ロードボタン -->
        <button
          class="load"
          @click="loadButtonOnClick"
        >ロード</button>

        <span style="flex: 1"></span>

        <!-- ボタン追加ボタン -->
        <button
          class="add"
          @click="addButtonOnClick"
        >ボタン追加</button>
      </div>
    </div>
    <div
      v-for="(selectBlock, blockIndex) in selectBlockList"
      :key="`block${blockIndex}`"
      :style="{ left: selectBlock.x, top: selectBlock.y }"
      class="selectBlock"
    >
      <span class="selectItem">{{selectBlock.label}}</span>
      <span
        v-for="(item, itemIndex) in selectBlock.itemList"
        :key="`block${blockIndex}-item${itemIndex}`"
        @mouseenter="event => item.onMouse(event, blockIndex, itemIndex)"
        @click="item.onClick"
        :style="{ left: item.x, top: item.y }"
        class="selectItem"
        :class="{ isEnd: selectBlock.isEnd, isHover: item.isHover }"
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
  @Action("changeListObj") private changeListObj: any;
  @Action("sendBcdiceServer") private sendBcdiceServer: any;
  @Action("setProperty") private setProperty: any;
  @Getter("publicCounterRemoconList") private publicCounterRemoconList: any;
  @Getter("getMapObjectList") private getMapObjectList: any;
  @Getter("getObj") private getObj: any;
  @Getter("chatActorKey") private chatActorKey: any;
  @Getter("propertyList") private propertyList: any;

  private selectBlockList: any[] = [];

  /**
   * 保存を行う
   */
  private saveButtonOnClick() {
    // TODO
    alert("未実装です。");
  }

  /**
   * 読み込みを行う
   */
  private loadButtonOnClick() {
    // TODO
    alert("未実装です。");
  }

  /**
   * カウンターリモコンボタンを追加する
   */
  private addButtonOnClick() {
    this.setProperty({
      property: `private.display.counterRemoconEditorWindow.objKey`,
      value: null,
      isNotice: false,
      logOff: true
    });
    this.windowOpen("private.display.counterRemoconEditorWindow");
  }

  /**
   * カウンターリモコンのメニューを表示する
   * @param event
   * @param remoconKey
   */
  private openContext(event: any, remoconKey: any): void {
    // ブロックを初期化
    this.selectBlockList = [];

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

  /**
   * 子画面の内側のクリックで、展開しているカウンターリモコンの選択肢を消す
   */
  private contentsOnClick() {
    // ブロックを初期化
    this.selectBlockList = [];
  }

  /*********************************************************************************************************************
   * カウンターリモコンで指定する情報の選択を開始
   * @param remoconObj
   * @param event
   */
  private remoconButtonOnClick(remoconObj: any, event: any) {
    // ブロックを初期化
    this.selectBlockList = [];

    const plusMarkProc: Function = (value: number): string =>
      value > 0 ? `+${value}` : `${value}`;

    /**=================================================================================================================
     * カウンター更新処理<br>
     * カウンターリモコン指定情報の選択を全て終えた時に呼び出す
     * @param counterName
     * @param value
     * @param character
     */
    const doChange: Function = (
      counterName: string,
      value: string,
      character: any
    ) => {
      // 対象のプロパティを特定
      let prop: string;
      switch (counterName) {
        case "イニシアティブ":
          prop = "initiative";
          break;
        case "修正（イニシアティブ同値時比較用）":
          prop = "subInitiative";
          break;
        default:
          prop = this.propertyList.filter(
            (prop: any) => prop.property === counterName
          )[0].refStr;
      }

      /**---------------------------------------------------------------------------------------------------------------
       * 実処理
       * @param beforeValue
       * @param commitValue
       * @param command
       */
      const commit: Function = (
        beforeValue: number,
        commitValue: number,
        command: string = ""
      ) => {
        const useCommitValue: number =
          remoconObj.modifyType === this.COUNTER_REMOCON_TYPE.MINUS
            ? -commitValue
            : commitValue;

        const afterValue: number =
          remoconObj.modifyType === this.COUNTER_REMOCON_TYPE.EQUALS
            ? useCommitValue
            : beforeValue + useCommitValue;

        // ログに出力
        this.addSimpleChatLog({
          text: remoconObj.message
            .replace("{0}", character.name)
            .replace("{1}", counterName)
            .replace(
              "{2}",
              `${
                remoconObj.modifyType === this.COUNTER_REMOCON_TYPE.EQUALS
                  ? useCommitValue
                  : plusMarkProc(useCommitValue)
              }` + (command ? `（${command}）` : "")
            )
            .replace(
              "{3}",
              `${useCommitValue}` + (command ? `（${command}）` : "")
            )
            .replace("{4}", `（${counterName}：${beforeValue}->${afterValue}）`)
        });

        // 実際にイニシアティブ表の値を更新
        const propertyObj: any = {};
        propertyObj[prop] = afterValue;
        this.changeListObj({
          key: character.key,
          isNotice: true,
          property: propertyObj
        });

        // ブロックを初期化
        this.selectBlockList = [];
      };

      const beforeValue: number = parseInt(character.property[prop], 10);
      if (/^-?[0-9]+$/.test(value)) {
        // カウンターリモコンに指定されていた変更値が数値だった場合、または値を選択された場合
        // 即更新 -------------------------------------------------------------------------------------------------------
        commit(beforeValue, parseInt(value, 10));
      } else {
        // カウンターリモコンに指定されていた変更値が数値ではなかった場合
        // BCDice-apiで評価してもらい、その応答の値を利用する
        this.sendBcdiceServer({
          system: "DiceBot",
          command: `${value}`
        }).then((json: any) => {
          if (json.ok) {
            // bcdiceとして結果が取れた場合
            const resultValue = json.result.replace(/^.+＞ /, "");
            if (/^-?[0-9]+$/.test(resultValue)) {
              // 数値として応答された
              const matchResult = json.result.match(
                /^.+＞ ([^＞]+) ＞ [^＞]+$/
              );
              // 応答の結果をもって更新 -----------------------------------------------------------------------------------
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

    /**=================================================================================================================
     * プロックを追加する処理
     * @param event
     * @param level
     * @param counterName
     * @param character
     * @param range
     */
    const addBlock: Function = (
      event: any,
      level: number,
      counterName: string,
      character: any = null,
      range: number[] | null = null
    ) => {
      if (remoconObj.target) {
        character = this.getObj(remoconObj.target);
      }

      const blockInfo: any = {
        onMouse: true
      };

      /**---------------------------------------------------------------------------------------------------------------
       * 値の選択肢を追加する処理
       */
      const addValueItems: Function = () => {
        blockInfo.isEnd = true;
        blockInfo.label = "値の選択";
        blockInfo.itemList = [];
        for (let i: number = range![0]; i <= range![1]; i++) {
          const text =
            remoconObj.modifyType === this.COUNTER_REMOCON_TYPE.EQUALS
              ? `${i}`
              : plusMarkProc(i);
          blockInfo.itemList.push({
            text,
            onMouse: (event: any, blockIndex: number, itemIndex: number) => {
              blockInfo.onMouse = true;
              this.selectBlockList[blockIndex].itemList.forEach(
                (item: any, index: number) =>
                  (item.isHover = index === itemIndex)
              );
              if (blockIndex > 0)
                this.selectBlockList[blockIndex - 1].onMouse = true;
            },
            onClick: () => {
              // カウンター更新処理
              doChange(
                counterName,
                remoconObj.modifyType === this.COUNTER_REMOCON_TYPE.MINUS
                  ? -i
                  : i,
                character
              );
            }
          });
        }
      };

      /**---------------------------------------------------------------------------------------------------------------
       * 範囲の選択肢を追加する処理
       */
      const addRangeItems: Function = () => {
        blockInfo.label = "範囲の選択";
        blockInfo.itemList = [];
        const diff = 10;
        let min = -90;
        let max = 99;
        if (remoconObj.modifyType === this.COUNTER_REMOCON_TYPE.PLUS) {
          min = 0;
        }
        if (remoconObj.modifyType === this.COUNTER_REMOCON_TYPE.MINUS) {
          max = -10;
        }
        for (let i = min; i <= max; i += diff) {
          const text =
            remoconObj.modifyType === this.COUNTER_REMOCON_TYPE.EQUALS
              ? `${i}〜${i + diff - 1}`
              : `${plusMarkProc(i)}〜${plusMarkProc(i + diff - 1)}`;
          blockInfo.itemList.push({
            text,
            onMouse: (event: any, blockIndex: number, itemIndex: number) => {
              blockInfo.onMouse = true;
              this.selectBlockList[blockIndex].itemList.forEach(
                (item: any, index: number) =>
                  (item.isHover = index === itemIndex)
              );
              if (blockIndex > 0)
                this.selectBlockList[blockIndex - 1].onMouse = true;
              addBlock(event, level + 1, counterName, character, [
                i,
                i + diff - 1
              ]);
            },
            onClick: () => {}
          });
        }
      };

      /**---------------------------------------------------------------------------------------------------------------
       * キャラクターの選択肢を追加する処理
       */
      const addCharacterItems: Function = () => {
        if (remoconObj.modifyValue) {
          blockInfo.isEnd = true;
        }
        blockInfo.label = "キャラクターの選択";
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
              // カウンター更新処理
              doChange(counterName, remoconObj.modifyValue, character);
            };
          } else {
            // 変更する値は決まってない場合
            result.onMouse = (
              event: any,
              blockIndex: number,
              itemIndex: number
            ) => {
              blockInfo.onMouse = true;
              this.selectBlockList[blockIndex].itemList.forEach(
                (item: any, index: number) =>
                  (item.isHover = index === itemIndex)
              );
              if (blockIndex > 0)
                this.selectBlockList[blockIndex - 1].onMouse = true;
              addBlock(event, level + 1, counterName, character);
            };
            result.onClick = () => {};
          }

          return result;
        });
      };

      /**---------------------------------------------------------------------------------------------------------------
       * カウンターの選択肢を追加する処理
       */
      const addCounterItems: Function = () => {
        const usePropertyList: any[] = this.propertyList.concat();

        usePropertyList.unshift({
          property: "修正（イニシアティブ同値時比較用）"
        });

        usePropertyList.unshift({
          property: "イニシアティブ"
        });

        blockInfo.label = "カウンターの選択";
        blockInfo.itemList = usePropertyList
          .filter((prop: any) => prop.type !== "checkbox")
          .map((prop: any) => ({
            text: prop.property,
            onMouse: (event: any, blockIndex: number, itemIndex: number) => {
              blockInfo.onMouse = true;
              this.selectBlockList[blockIndex].itemList.forEach(
                (item: any, index: number) =>
                  (item.isHover = index === itemIndex)
              );
              if (blockIndex > 0)
                this.selectBlockList[blockIndex - 1].onMouse = true;
              addBlock(event, level + 1, prop.property, character);
            },
            onClick: () => {}
          }));
      };

      // ---------------------------------------------------------------------------------------------------------------

      if (!counterName) {
        // カウンターが選択されていない場合
        addCounterItems();
      } else if (!character) {
        // キャラクターが選択されていない場合
        addCharacterItems();
      } else if (!remoconObj.modifyValue) {
        // 変更する値が決まってない場合
        if (!range) {
          // 範囲が未指定の場合
          addRangeItems();
        } else {
          // 範囲が指定されている場合
          addValueItems();
        }
      } else {
        // カウンター更新処理
        doChange(counterName, remoconObj.modifyValue, character);
        return;
      }

      const contentsElm: HTMLDivElement = this.$refs.contents as HTMLDivElement;
      const relativeElm: HTMLDivElement = contentsElm.parentNode as HTMLDivElement;
      const relRect = relativeElm.getBoundingClientRect();
      const targetRect = event.target.getBoundingClientRect();
      blockInfo.x =
        targetRect.left + targetRect.width - relRect.left - 1 + "px";
      blockInfo.y = `calc(${targetRect.top - relRect.top + 2}px - 1.5em)`;
      blockInfo.level = level;

      listDelete(this.selectBlockList, (item: any) => level <= item.level);
      this.selectBlockList.push(blockInfo);
    };

    addBlock(event, 1, remoconObj.counterName);
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
    margin-top: 0.15em;

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
    overflow-y: auto;

    button {
      height: 3em;
      margin: 0.15em 0.3em 0.15em 0;
      font-weight: bold;
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
  height: 1.5em;

  &:first-child {
    background-color: black;
    color: white;
    font-weight: bold;
  }

  &:not(:first-child) {
    &:hover,
    &.isHover {
      background-color: lightblue;
    }

    &:not(.isEnd) {
      padding-right: 1em;

      &:after {
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
  }
}

button {
  border-radius: 0.5em;

  &:disabled {
    background-color: lightgrey;
  }
}
</style>
