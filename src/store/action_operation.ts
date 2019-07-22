import Vue from "vue";
import {
  toInitiativeObjList,
  arrangeInitiativeWidthList
} from "@/components/common/Utility";

export default {
  actions: {
    sendChatLog: (
      {
        dispatch,
        commit,
        rootGetters
      }: { dispatch: Function; commit: Function; rootGetters: any },
      payload: any
    ) => {
      const actorKey: string = payload.actorKey || rootGetters.chatActorKey;
      const text: string = payload.text;
      const outputTab: string = payload.outputTab || rootGetters.activeChatTab;
      const statusName: string = payload.statusName || "◆";
      const chatTarget: string = payload.chatTarget || "groupTargetTab-0";
      const currentDiceBotSystem: string =
        payload.currentDiceBotSystem || "DiceBot";

      // -------------------
      // ダイスBot処理
      // -------------------
      const outputNormalChat = (commandStr: string) => {
        if (!/[@><+-/*=0-9a-zA-Z()"?^$]+/.test(commandStr)) {
          // -------------------
          // プレイヤー発言
          // -------------------
          dispatch("addChatLog", {
            name: rootGetters.getViewName(actorKey),
            text,
            // color,
            tab: outputTab,
            actorKey: actorKey,
            statusName,
            target: chatTarget,
            owner: actorKey
          });
          return;
        }
        dispatch("sendBcdiceServer", {
          system: currentDiceBotSystem,
          command: commandStr
        })
          .then((json: any) => {
            let isDiceRoll: boolean = false;
            let isSecretDice: boolean = false;
            let diceRollResult: string | null = null;
            let dices: any = null;

            if (json.ok) {
              // bcdiceとして結果が取れた
              const resultStr: string = json.result;
              isSecretDice = json.secret;
              dices = json.dices;

              window.console.log(json);

              diceRollResult = resultStr
                .replace(/(^: )/g, "")
                .replace(/＞/g, "→");
              isDiceRoll = true;
            } else {
              // bcdiceとして結果は取れなかった
            }

            dispatch("setProperty", {
              property: `public.chat.diceBotMessage`,
              value: {
                // message: "",
                isView: false
              },
              isNotice: true,
              logOff: true
            });
            if (isDiceRoll && isSecretDice) {
              // -------------------
              // シークレットダイス
              // -------------------
              dispatch("addChatLog", {
                name: rootGetters.getViewName(actorKey),
                text: `シークレットダイス`,
                // color: color,
                tab: outputTab,
                actorKey: actorKey,
                statusName: statusName,
                target: chatTarget,
                owner: actorKey
              });

              // 隠しダイスロール結果画面に反映
              commit("addSecretDice", {
                name: rootGetters.getViewName(actorKey),
                diceBot: currentDiceBotSystem,
                text,
                diceRollResult: diceRollResult,
                // color: color,
                tab: outputTab,
                actorKey: actorKey,
                statusName: statusName,
                target: chatTarget,
                owner: actorKey,
                dices
              });
            } else {
              // -------------------
              // プレイヤー発言
              // -------------------
              dispatch("addChatLog", {
                name: rootGetters.getViewName(actorKey),
                text,
                // color,
                tab: outputTab,
                actorKey: actorKey,
                statusName: statusName,
                target: chatTarget,
                owner: actorKey
              });
              if (isDiceRoll) {
                // -------------------
                // ダイスロール結果
                // -------------------
                dispatch("addChatLog", {
                  name: currentDiceBotSystem,
                  text: diceRollResult,
                  // color,
                  tab: outputTab,
                  actorKey: actorKey,
                  statusName: statusName,
                  target: chatTarget,
                  owner: actorKey,
                  dices,
                  isDiceBot: true
                });
              }
            }
          })
          .catch((err: any) => {
            window.console.error(err);
          });
      };

      // -------------------
      // 独自ダイスBot処理
      // -------------------
      const commandStr = text
        .split(new RegExp("\\s+"))[0]
        .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s: string) =>
          String.fromCharCode(s.charCodeAt(0) - 65248)
        )
        .toLowerCase();
      const customDiceBotObj: any = rootGetters.customDiceBotList.filter(
        (customDiceBotObj: any) =>
          customDiceBotObj.commandName.toLowerCase() === commandStr
      )[0];
      const customDiceBotRoomSysObj: any = rootGetters.customDiceBotRoomSysList.filter(
        (customDiceBotObj: any) =>
          customDiceBotObj.commandName.toLowerCase() === commandStr
      )[0];
      const useCustomDiceBotObj = customDiceBotObj || customDiceBotRoomSysObj;
      if (!useCustomDiceBotObj) {
        // 独自ダイスボットが見つからなかったので通常のチャット処理
        outputNormalChat(commandStr);
      } else {
        // 独自ダイスボットが見つかった
        const diceRoll = useCustomDiceBotObj.diceRoll;
        const tableTitle = useCustomDiceBotObj.tableTitle;
        const diceBotSystem = useCustomDiceBotObj.diceBotSystem;
        const tableContents = useCustomDiceBotObj.tableContents;
        const customTableInfoList: any[] = tableContents
          .split(/[\r\n]+/)
          .map((lineStr: string) => {
            const matchResult: any = lineStr.match(/^([^:：]+)[:：](.+)$/);
            if (!matchResult) return null;
            const key: string = matchResult[1];
            const value: string = matchResult[2];
            return { key, value };
          })
          .filter((info: any) => info);

        dispatch("sendBcdiceServer", {
          system: diceBotSystem,
          command: diceRoll
        }).then((json: any) => {
          let diceRollResult: string | null = null;
          let diceResultStr: string | null = null;
          let dices: any[] | null = null;
          if (json.ok) {
            // bcdiceとして結果が取れた
            const resultStr: string = json.result;
            dices = json.dices;
            diceRollResult = resultStr.replace(/^.*＞ */, "");
            let sum = 0;
            diceResultStr = dices!
              .map((dice: any) => {
                sum += dice.value;
                return dice.value;
              })
              .join(",");
            diceResultStr = `(${sum}[${diceResultStr}])`;
          }

          const customDiceBotResult = customTableInfoList.filter(
            customTableInfo => customTableInfo.key === diceRollResult
          )[0];

          const customDiceBotResultText: string = [
            tableTitle,
            diceResultStr,
            " → ",
            customDiceBotResult ? customDiceBotResult.value : "該当値なし"
          ].join("");

          dispatch("setProperty", {
            property: `public.chat.diceBotMessage`,
            value: {
              message: customDiceBotResult
                ? customDiceBotResult.value
                : ["該当値なし", diceRollResult].join("\n"),
              isView: true
            },
            isNotice: true,
            logOff: true
          });

          dispatch("addChatLog", {
            name: rootGetters.getViewName(actorKey),
            text,
            // color,
            tab: outputTab,
            actorKey: actorKey,
            statusName: statusName,
            target: chatTarget,
            owner: actorKey
          });
          dispatch("addChatLog", {
            name: diceBotSystem,
            text: customDiceBotResultText,
            // color,
            tab: outputTab,
            actorKey: actorKey,
            statusName: statusName,
            target: chatTarget,
            owner: actorKey,
            dices,
            isDiceBot: true
          });
        });
      }
    },
    /** ========================================================================
     * チャットログを追加する
     */
    addChatLog: (
      { dispatch, rootGetters }: { dispatch: Function; rootGetters: any },
      payload: any
    ) => {
      dispatch("sendNoticeOperation", {
        value: payload,
        method: "doAddChatLog"
      });
    },
    doAddChatLog: (
      {
        dispatch,
        rootState,
        rootGetters
      }: { dispatch: Function; rootState: any; rootGetters: any },
      payload: any
    ) => {
      let text = payload.text;

      if (!text.startsWith("@")) {
        const activeChatTab = rootGetters.activeChatTab;

        const actorKey = payload.actorKey || rootGetters.chatActorKey;
        const name = payload.name || rootGetters.getViewName(actorKey);
        const color = payload.color || rootGetters.getChatColor(actorKey);
        const tab = payload.tab || activeChatTab;
        const from =
          payload.from || rootGetters.getOwnerKey(rootGetters.chatActorKey);
        const target = payload.target;
        const isDiceBot: boolean = payload.isDiceBot || false;
        const statusName = payload.statusName || "◆";

        /*
         * 立ち絵の表示
         */
        const actor: any = rootGetters.getObj(actorKey);
        if (actor) {
          const status: any = actor.statusList.filter(
            (status: any) => status.name === statusName
          )[0];
          if (status) {
            const standImageList: any =
              rootGetters.display.chatWindow.standImageList;
            if (status.standImage.base || status.standImage.diffList.length) {
              const standImageObj = {
                actorKey: actorKey,
                statusName: statusName,
                standImage: status.standImage
              };
              const index: number = standImageList.findIndex(
                (standImageObj: any) => standImageObj.actorKey === actorKey
              );
              if (index >= 0) standImageList.splice(index, 1);
              standImageList.push(standImageObj);
            }
          }
        }

        let useTargetText: string = "";
        if (target) {
          const targetName = rootGetters.getObj(target).name;
          useTargetText = targetName === "全体" ? "" : " > " + targetName;
        }
        const viewHtml = [
          `<span style="color: ${color};`,
          isDiceBot ? " background-color: #eee;" : "",
          `"><b>`,
          name + useTargetText,
          "</b>：",
          text.replace(/\r?\n/g, "<br />"),
          "</span>"
        ].join("");

        // ダイスボットメッセージの表示判定
        if (isDiceBot && !/^[^→]+→[ →0-9,[\]]+$/.test(text)) {
          dispatch("setProperty", {
            property: `public.chat.diceBotMessage`,
            value: {
              message: text.replace(/^[^→]+→ */, ""),
              isView: true
            },
            isNotice: true,
            logOff: true
          });
        }

        const logObj = {
          owner: payload.owner,
          target,
          from,
          actorKey,
          viewHtml,
          statusName,
          isDiceBot
        };
        // 未読カウントアップ
        if (tab !== activeChatTab) {
          const index = rootGetters.chatTabsOption.findIndex(
            (tabObj: any) => tabObj.key === tab
          );
          const tabObj = rootGetters.chatTabsOption[index];
          tabObj.unRead++;
          rootGetters.chatTabsOption.splice(index, 1, tabObj);
        }
        rootGetters.chatLogs[tab].push(logObj);
      }

      // チャット文字連携処理
      dispatch("chatLinkage", text);
    },

    /** ========================================================================
     * チャット文字色変更
     */
    changeChatFontColor: (
      { dispatch }: { dispatch: Function },
      payload: any
    ) => {
      dispatch("sendNoticeOperation", {
        value: payload,
        method: "doChangeChatFontColor"
      });
    },
    doChangeChatFontColor: (
      {
        dispatch,
        rootState,
        rootGetters
      }: { dispatch: Function; rootState: any; rootGetters: any },
      {
        key,
        color,
        historyChange
      }: { key: string; color: string; historyChange: boolean }
    ) => {
      const kind = key.split("-")[0];
      const target = rootState.public[kind].list.filter(
        (obj: any) => obj.key === key
      )[0];
      if (!target) return;
      target.fontColor = color;
      if (!historyChange) return;
      const change: any = {};
      for (const tab in rootGetters.chatLogs) {
        if (!rootGetters.chatLogs.hasOwnProperty(tab)) continue;
        const changeTab: any = {};
        change[tab] = changeTab;
        rootGetters.chatLogs[tab].forEach((log: any, index: number) => {
          if (log.actorKey !== target.key) return;
          changeTab[index] = {
            viewHtml: log.viewHtml.replace(
              /^(<span style="color: )([^;]+)(;">)/,
              `$1${color}$3`
            )
          };
        });
      }
      dispatch("setProperty", {
        property: `public.chat.logs`,
        value: change,
        isNotice: false,
        logOff: true
      });
    },

    /** ========================================================================
     * チャットタブ追加処理
     */
    addChatTab: (
      { dispatch }: { dispatch: Function },
      payload: any
    ): string => {
      return dispatch("sendNoticeOperation", {
        value: payload,
        method: "doAddChatTab"
      });
    },
    doAddChatTab: (
      { rootState, rootGetters }: { rootState: any; rootGetters: any },
      {
        name,
        isActive = false,
        isHover = false,
        unRead = 0,
        order = rootState.public.chat.tab.list.length
      }: {
        name: string | undefined;
        isActive: boolean | undefined;
        isHover: boolean | undefined;
        unRead: number | undefined;
        order: number;
      }
    ) => {
      const key = `chatTab-${++rootState.public.chat.tab.maxKey}`;
      const publicTab = {
        key: key,
        name: name
      };
      const privateTab = {
        key: key,
        isActive: isActive,
        isHover: isHover,
        unRead: unRead,
        order: order
      };
      rootState.public.chat.tab.list.push(publicTab);
      rootState.private.chat.tab.push(privateTab);
      Vue.set(rootGetters.chatLogs, key, []);
    },

    /** ========================================================================
     * チャットタブ更新処理
     */
    updateChatTab: (
      { dispatch }: { dispatch: Function },
      payload: any
    ): string => {
      return dispatch("sendNoticeOperation", {
        value: payload,
        method: "doUpdateChatTab"
      });
    },
    doUpdateChatTab: (
      { rootState }: { rootState: any },
      {
        key,
        name = undefined,
        isActive = undefined,
        isHover = undefined,
        unRead = undefined
      }: {
        key: string;
        name: string | undefined;
        isActive: boolean | undefined;
        isHover: boolean | undefined;
        unRead: number | undefined;
      }
    ) => {
      const publicTabIndex = rootState.public.chat.tab.list.findIndex(
        (tab: any) => tab.key === key
      );
      const publicTab = rootState.public.chat.tab.list[publicTabIndex];
      const privateTabIndex = rootState.private.chat.tab.findIndex(
        (tab: any) => tab.key === key
      );
      const privateTab = rootState.private.chat.tab[publicTabIndex];
      if (name !== undefined) publicTab.name = name;
      if (isActive !== undefined) privateTab.isActive = isActive;
      if (isHover !== undefined) privateTab.isHover = isHover;
      if (unRead !== undefined) privateTab.isActive = unRead;
      rootState.public.chat.tab.list.splice(publicTabIndex, 1, publicTab);
      rootState.private.chat.tab.splice(privateTabIndex, 1, privateTab);
    },

    /** ========================================================================
     * チャットタブ削除処理
     */
    deleteChatTab: (
      { dispatch }: { dispatch: Function },
      payload: any
    ): string => {
      return dispatch("sendNoticeOperation", {
        value: payload,
        method: "doDeleteChatTab"
      });
    },
    doDeleteChatTab: (
      { rootState }: { rootState: any },
      { key }: { key: string }
    ) => {
      const publicTabIndex = rootState.public.chat.tab.list.findIndex(
        (tab: any) => tab.key === key
      );
      const privateTabIndex = rootState.private.chat.tab.findIndex(
        (tab: any) => tab.key === key
      );
      rootState.public.chat.tab.list.splice(publicTabIndex, 1);
      rootState.private.chat.tab.splice(privateTabIndex, 1);
    },

    /** ========================================================================
     * チャット文字連携処理
     */
    chatLinkage: (
      {
        dispatch,
        rootState,
        rootGetters
      }: { dispatch: Function; rootState: any; rootGetters: any },
      text: string
    ) => {
      rootState.public.bgm.list
        .filter((bgmObj: any) => {
          if (
            bgmObj.chatLinkage === 1 &&
            text.endsWith(bgmObj.chatLinkageSearch)
          ) {
            return true;
          }
          return (
            bgmObj.chatLinkage === 2 &&
            new RegExp(bgmObj.chatLinkageSearch).test(text)
          );
        })
        .sort((a: any, b: any) => {
          if (a.title.length > b.title.length) return -1;
          if (a.title.length < b.title.length) return 1;
          return 0;
        })
        .filter(
          (bgmObj: any, index: number, self: any) =>
            self.filter(
              (s: any, i: number) => index > i && s.tag === bgmObj.tag
            ).length === 0
        )
        .forEach((bgmObj: any) => {
          dispatch("setProperty", {
            property: "private.display.jukeboxWindow.command",
            isNotice: true,
            value: { command: "add", payload: bgmObj.key }
          });
        });
    },

    /** ========================================================================
     * 画像を追加する
     */
    addImage: ({ dispatch }: { dispatch: Function }, payload: any): string => {
      return dispatch("sendNoticeOperation", {
        value: payload,
        method: "doAddImage"
      });
    },
    doAddImage: (
      { rootState, rootGetters }: { rootState: any; rootGetters: any },
      {
        name,
        tag,
        data,
        thumbnail,
        imageArgList,
        owner
      }: {
        name: string;
        tag: string;
        data: any;
        thumbnail: string;
        imageArgList: string[];
        owner: string;
      }
    ): string => {
      // 欠番を埋める方式は不採用
      let maxKey = rootState.public.image.maxKey;
      const key = `image-${++maxKey}`;
      rootState.public.image.maxKey = maxKey;
      rootState.public.image.list.push({
        key,
        name,
        tag: tag.trim(),
        data,
        thumbnail,
        imageArgList,
        owner
      });

      const regExp: RegExp = new RegExp("[ 　]+", "g");
      const tagStrList: string[] = tag.trim().split(regExp);
      tagStrList.forEach(tagStr => {
        let tagObj: any = rootGetters.imageTagList.filter(
          (imageTagObj: any) => imageTagObj.name === tagStr
        )[0];
        if (!tagObj) {
          const key: string = `imgTag-${++rootState.public.image.tags.maxKey}`;
          tagObj = {
            key,
            name: tagStr
          };
          rootGetters.imageTagList.push(tagObj);
        }
      });
      if (rootGetters.playerKey === owner) {
        rootGetters.historyList.push({ type: "add", key });
      }
      return key;
    },

    /** ========================================================================
     * イニシアティブ表のパラメータの設定を変更する
     */
    setInitiativeParams: (
      { dispatch }: { dispatch: Function },
      payload: any
    ): string => {
      return dispatch("sendNoticeOperation", {
        value: payload,
        method: "doSetInitiativeParams"
      });
    },
    doSetInitiativeParams: (
      { dispatch, rootState }: { dispatch: Function; rootState: any },
      { format }: { format: string }
    ) => {
      // 数値配列の合計値を求める
      const sum = (list: number[]): number =>
        list.reduce((accumlator, current) => accumlator + current);

      // １行のテキストをパースしてイニシアティブ表用のオブジェクト配列を生成
      const formatObjList: any[] = toInitiativeObjList(format);
      const newWidthList: number[] = arrangeInitiativeWidthList(
        rootState.private.display.initiativeWindow.widthList,
        formatObjList
      );
      dispatch("setProperty", {
        property: `private.display.initiativeWindow.widthList`,
        value: newWidthList,
        isNotice: false,
        logOff: true
      });
      dispatch("setProperty", {
        property: `public.initiative.propertyList`,
        value: formatObjList,
        isNotice: false,
        logOff: true
      });
    },

    /** ========================================================================
     * アクター状態を追加する
     */
    addActorStatus: ({ dispatch }: { dispatch: Function }, payload: any) => {
      dispatch("sendNoticeOperation", {
        value: payload,
        method: "doAddActorStatus"
      });
    },
    doAddActorStatus: (
      { rootState, rootGetters }: { rootState: any; rootGetters: any },
      payload: any
    ) => {
      const actor: any = rootGetters.getObj(payload.key);
      delete payload.key;
      delete payload.ownerPeerId;

      actor.statusList.push(payload);
    },

    /** ========================================================================
     * アクター状態を削除する
     */
    deleteActorStatus: ({ dispatch }: { dispatch: Function }, payload: any) => {
      dispatch("sendNoticeOperation", {
        value: payload,
        method: "doDeleteActorStatus"
      });
    },
    doDeleteActorStatus: (
      { rootState, rootGetters }: { rootState: any; rootGetters: any },
      payload: any
    ) => {
      const actor: any = rootGetters.getObj(payload.key);
      const index = actor.statusList.findIndex(
        (status: any) => status.name === payload.statusName
      );
      actor.statusList.splice(index, 1);
    },

    /** ========================================================================
     * 立ち絵差分を追加する
     */
    addStandImageDiff: ({ dispatch }: { dispatch: Function }, payload: any) => {
      dispatch("sendNoticeOperation", {
        value: payload,
        method: "doAddStandImageDiff"
      });
    },
    doAddStandImageDiff: (
      { rootState, rootGetters }: { rootState: any; rootGetters: any },
      payload: any
    ) => {
      const actor: any = rootGetters.getObj(payload.key);
      delete payload.key;
      delete payload.ownerPeerId;
      const status = actor.statusList.filter(
        (status: any) => status.name === payload.statusName
      )[0];
      delete payload.statusName;

      status.standImage.diffList.push(payload);
    },

    /** ========================================================================
     * 立ち絵差分を削除する
     */
    deleteStandImageDiff: (
      { dispatch }: { dispatch: Function },
      payload: any
    ) => {
      dispatch("sendNoticeOperation", {
        value: payload,
        method: "doDeleteStandImageDiff"
      });
    },
    doDeleteStandImageDiff: (
      { rootState, rootGetters }: { rootState: any; rootGetters: any },
      payload: any
    ) => {
      const actor: any = rootGetters.getObj(payload.key);
      const status = actor.statusList.filter(
        (status: any) => status.name === payload.statusName
      )[0];
      delete payload.statusName;
      status.standImage.diffList.splice(payload.index, 1);
    },

    /** ========================================================================
     * 立ち絵差分を編集する
     */
    editStandImageDiff: (
      { dispatch }: { dispatch: Function },
      payload: any
    ) => {
      dispatch("sendNoticeOperation", {
        value: payload,
        method: "doEditStandImageDiff"
      });
    },
    doEditStandImageDiff: (
      {
        dispatch,
        rootState,
        rootGetters
      }: { dispatch: Function; rootState: any; rootGetters: any },
      payload: any
    ) => {
      const key = payload.key;
      delete payload.key;
      const index: number = payload.index;
      delete payload.index;
      delete payload.ownerPeerId;
      const statusName: string = payload.statusName;
      delete payload.statusName;

      const actor: any = rootGetters.getObj(key);

      const statusIndex = actor.statusList.findIndex(
        (status: any) => status.name === statusName
      );

      const updateDiff: any = {};
      updateDiff[index] = payload;
      const updateStatusList: any = {};
      updateStatusList[statusIndex] = {
        standImage: {
          diffList: updateDiff
        }
      };

      // window.console.log("★★★", key, "★ statusList:", updateStatusList);

      dispatch("changeListObj", {
        key: key,
        statusList: updateStatusList
      });
    },

    /** ========================================================================
     * publicリストにオブジェクトを追加する
     * @param dispatch
     * @param rootGetters
     * @param payload
     */
    addListObj: (
      { dispatch, rootGetters }: { dispatch: Function; rootGetters: any },
      payload: any
    ) => {
      payload.owner = payload.owner || rootGetters.playerKey;
      dispatch("sendNoticeOperation", {
        value: payload,
        method: "doAddListObj"
      });
    },
    doAddListObj: (
      {
        dispatch,
        rootState,
        rootGetters
      }: { dispatch: Function; rootState: any; rootGetters: any },
      payload: any
    ) => {
      // 欠番を埋める方式は不採用
      let maxKey = rootState.public[payload.propName].maxKey;
      const key = `${payload.kind}-${++maxKey}`;
      rootState.public[payload.propName].maxKey = maxKey;

      payload.key = key;
      delete payload.ownerPeerId;
      delete payload.isNotice;

      // window.console.log(payload);

      if (rootGetters.playerKey === payload.owner) {
        rootGetters.historyList.push({ type: "add", key });
      }
      rootState.public[payload.propName].list.push(payload);
    },

    /** ========================================================================
     * publicリストの中の指定されたkeyのオブジェクト情報を変更する
     * @param dispatch
     * @param payload
     */
    changeListObj: ({ dispatch }: { dispatch: Function }, payload: any) => {
      dispatch("sendNoticeOperation", {
        value: payload,
        method: "doChangeListObj"
      });
    },
    doChangeListObj: (
      {
        dispatch,
        rootState,
        rootGetters
      }: { dispatch: Function; rootState: any; rootGetters: any },
      payload: any
    ) => {
      const key = payload.key;
      const propName = key.split("-")[0];

      delete payload.key;
      const index = rootState.public[propName].list.findIndex(
        (obj: any) => obj.key === key
      );
      dispatch("setProperty", {
        property: `public.${propName}.list.${index}`,
        value: payload,
        isNotice: false,
        logOff: true
      });
    },

    /** ========================================================================
     * publicリストの中の指定されたkeyのオブジェクト情報を変更する
     * @param dispatch
     * @param payload
     */
    changePublicMemoObj: (
      { dispatch }: { dispatch: Function },
      payload: any
    ) => {
      dispatch("sendNoticeOperation", {
        value: payload,
        method: "doChangePublicMemoObj"
      });
    },
    doChangePublicMemoObj: (
      {
        dispatch,
        rootState,
        rootGetters
      }: { dispatch: Function; rootState: any; rootGetters: any },
      payload: any
    ) => {
      const list = rootState.public.publicMemo.list;
      const index = list.findIndex((obj: any) => obj.key === payload.key);
      list.splice(index, 1, payload);
    },

    /** ========================================================================
     * publicリストの中の指定されたkeyのオブジェクトを削除する
     * @param dispatch
     * @param payload
     */
    deleteListObj: ({ dispatch }: { dispatch: Function }, payload: any) => {
      dispatch("sendNoticeOperation", {
        value: payload,
        method: "doDeleteListObj"
      });
    },
    doDeleteListObj: (
      { rootState, rootGetters }: { rootState: any; rootGetters: any },
      payload: any
    ) => {
      const obj = rootGetters.getObj(payload.key);
      rootState.public[payload.propName].list.splice(
        rootState.public[payload.propName].list.indexOf(obj),
        1
      );

      if (rootGetters.playerKey === payload.playerKey) {
        rootGetters.historyList.splice(
          rootGetters.historyList.findIndex(
            (hisObj: any) => hisObj.key === payload.key
          ),
          1
        );
      }
    },

    /** ========================================================================
     * publicリストの中の指定されたkeyのオブジェクトをコピーする
     * @param dispatch
     * @param payload
     */
    copyListObj: ({ dispatch }: { dispatch: Function }, payload: any) => {
      dispatch("sendNoticeOperation", {
        value: payload,
        method: "doCopyListObj"
      });
    },
    doCopyListObj: (
      {
        dispatch,
        rootState,
        rootGetters
      }: {
        dispatch: Function;
        rootState: any;
        rootGetters: any;
      },
      payload: any
    ) => {
      const obj = rootGetters.getObj(payload.key);
      dispatch("doAddListObj", obj);
    },

    /** ========================================================================
     * publicリストの中の指定されたkeyのオブジェクトの位置を変更する
     * @param dispatch
     * @param payload
     */
    moveListObj: ({ dispatch }: { dispatch: Function }, payload: any) => {
      dispatch("sendNoticeOperation", {
        value: payload,
        method: "doMoveListObj"
      });
    },
    doMoveListObj: (
      {
        dispatch,
        rootState,
        rootGetters
      }: {
        dispatch: Function;
        rootState: any;
        rootGetters: any;
      },
      payload: any
    ) => {
      const key = payload.key;
      const afterIndex = payload.afterIndex;
      const propName = key.split("-")[0];
      const list = rootState.public[propName].list;
      const index = list.findIndex((obj: any) => obj.key === key);
      const obj = list.splice(index, 1)[0];
      list.splice(afterIndex, 0, obj);
    },

    /** ========================================================================
     * デッキのシャッフル
     */
    shuffleDeck: ({ dispatch }: { dispatch: Function }) => {
      dispatch("sendNoticeOperation", { value: {}, method: "doShuffleDeck" });
    },
    doShuffleDeck: ({
      rootState,
      rootGetters
    }: {
      rootState: any;
      rootGetters: any;
    }) => {
      const cardList = rootGetters.deckCardList.concat();
      for (let i = cardList.length - 1; i >= 0; i--) {
        // 0~iのランダムな数値を取得
        const rand = Math.floor(Math.random() * (i + 1));

        // [cardList[i], cardList[rand]] = [cardList[rand], cardList[i]]
        const tmp = cardList[i];
        cardList[i] = cardList[rand];
        cardList[rand] = tmp;
        // cardList.splice(i, 1, cardList[rand])
        // cardList.splice(rand, 1, tmp)
      }
      rootState.public.deck.cards.list = cardList;
      // cardList.splice(0, 1, cardList[0])
    },

    /** ========================================================================
     * カードのドロー
     */
    drawCard: ({ dispatch }: { dispatch: Function }, payload: any) => {
      dispatch("sendNoticeOperation", { value: payload, method: "doDrawCard" });
    },
    doDrawCard: (
      { rootState, rootGetters }: { rootState: any; rootGetters: any },
      payload: any
    ) => {
      const index = payload.index;
      // const cardKey = payload.key

      const cardList = rootGetters.deckCardList;
      const card = cardList[index];
      cardList.splice(index, 1);

      // TODO 手札に加える処理
      rootState.private.self.cards.push(card);
    },

    /** ========================================================================
     * グループチャットの追加
     */
    addGroupTargetTab: ({ dispatch }: { dispatch: Function }, payload: any) => {
      dispatch("sendNoticeOperation", {
        value: payload,
        method: "doAddGroupTargetTab"
      });
    },
    doAddGroupTargetTab: (
      { rootGetters }: { rootGetters: any },
      payload: any
    ) => {
      rootGetters.groupTargetTabList.push({
        key: `groupTargetTab-${++rootGetters.groupTargetTab.maxKey}`,
        isSecret: false,
        name: "",
        targetTab: "",
        isAll: false,
        group: [payload.ownerKey]
      });
    },

    /** ========================================================================
     * グループチャットの削除
     */
    deleteGroupTargetTab: (
      { dispatch }: { dispatch: Function },
      payload: any
    ) => {
      dispatch("sendNoticeOperation", {
        value: payload,
        method: "doDeleteGroupTargetTab"
      });
    },
    doDeleteGroupTargetTab: (
      { rootState, rootGetters }: { rootState: any; rootGetters: any },
      payload: any
    ) => {
      if (payload.key === "groupTargetTab-0") {
        alert("これは削除できません。");
        return;
      }
      const obj = rootGetters.getObj(payload.key);
      const list = rootGetters.groupTargetTabList;
      list.splice(list.indexOf(obj), 1);
    },

    /** ========================================================================
     * カウンターリモコンの追加
     */
    addCounterRemocon: ({ dispatch }: { dispatch: Function }, payload: any) => {
      dispatch("sendNoticeOperation", {
        value: payload,
        method: "doAddCounterRemocon"
      });
    },
    doAddCounterRemocon: (
      { rootGetters }: { rootGetters: any },
      payload: any
    ) => {
      rootGetters.publicCounterRemoconList.push({
        key: `counterRemocon-${++rootGetters.publicCounterRemocon.maxKey}`,
        buttonName: payload.buttonName,
        target: payload.target,
        counterName: payload.counterName,
        modifyType: payload.modifyType,
        modifyValue: payload.modifyValue,
        message: payload.message,
        exampleText: payload.exampleText
      });
    },

    /** ========================================================================
     * チャットタブの構成を変更する
     */
    changeChatTab: ({ dispatch }: { dispatch: Function }, payload: any) => {
      dispatch("sendNoticeOperation", {
        value: payload,
        method: "doChangeChatTab"
      });
    },
    /**
     * チャットのタブの構成を変更する
     * @param rootState
     * @param rootGetters
     * @param commit
     * @param payload
     * @returns {*}
     */
    doChangeChatTab: (
      {
        rootState,
        rootGetters,
        commit
      }: { rootState: any; rootGetters: any; commit: Function },
      payload: any
    ) => {
      const lastActiveTab = rootGetters.activeChatTab;
      let tabsText = payload.tabsText.trim();
      // 秘匿チャット以外を削除
      rootGetters.chatTabs
        .map((tab: any, index: number) => {
          if (!tab.secretInfo) return;
          return index;
        })
        .reverse()
        .forEach((index: number) => rootGetters.chatTabs.splice(index, 1));

      tabsText = "メイン " + tabsText;
      const regExp = new RegExp("[ 　]+", "g");
      let tabs = tabsText.replace(regExp, " ").split(" ");
      for (let tab of tabs) {
        let isActive = false;
        if (lastActiveTab && lastActiveTab === tab) {
          isActive = true;
        }
        let tabObj = {
          name: tab,
          isActive: isActive,
          isHover: false,
          unRead: 0,
          secretInfo: null
        };
        rootGetters.chatTabs.push(tabObj);
      }
      if (!lastActiveTab) {
        rootGetters.chatTabs[0].isActive = true;
      }

      // 削除されたタブの検知
      let deleteLogTabList = [];
      for (let tab in rootGetters.chatLogs) {
        if (!rootGetters.chatLogs.hasOwnProperty(tab)) continue;
        let findFlg = false;
        for (const tabsTab of rootGetters.chatTabs) {
          if (tabsTab.name === tab) {
            findFlg = true;
            break;
          }
        }
        if (!findFlg) {
          deleteLogTabList.push(tab);
        }
      }
      deleteLogTabList.forEach(
        delTabName => delete rootGetters.chatLogs[delTabName]
      );

      // 追加されたタブの検知
      rootGetters.chatTabs.forEach((tabsTab: any) => {
        if (!rootGetters.chatLogs[tabsTab.name]) {
          // this.$set(state.chat.logs, tabsTab.name, [])
          const newLogs = { ...rootGetters.chatLogs };
          newLogs[tabsTab.key] = [];
          rootGetters.chatLogs = newLogs;
          // state.chat.logs[tabsTab.name] = []
        }
      });
    }
  },
  getters: {
    chatLogList: (
      state: any,
      getters: any,
      rootState: any,
      rootGetters: any
    ) => {
      return rootGetters.chatLogs[rootGetters.activeChatTab].filter(
        (log: any) => {
          if (log.from === rootGetters.playerKey) return true;
          if (!log.target) return true;
          if (log.target === "groupTargetTab-0") return true;
          const kind = log.target.split("-")[0];
          if (kind === "groupTargetTab") {
            const target = getters.getObj(log.target);
            if (!target.isSecret) return true;
            if (target.isAll) return true;
            const findIndex = target.group.findIndex((g: string) => {
              const kind = g.split("-")[0];
              if (kind === "player") {
                if (g === rootGetters.playerKey) return true;
              } else if (kind === "character") {
                if (getters.getObj(g).owner === rootGetters.playerKey)
                  return true;
              }
              return false;
            });
            return findIndex > -1;
          } else if (kind === "player") {
            return log.target === rootGetters.playerKey;
          } else {
            const target = getters.getObj(log.target);
            return target.owner === rootGetters.playerKey;
          }
        }
      );
    },
    groupTargetTabListFiltered: (
      state: any,
      getters: any,
      rootState: any,
      rootGetters: any
    ) => {
      return rootGetters.groupTargetTabList.filter((tab: any) => {
        if (tab.isAll) return true;
        const filterObj = tab.group.filter((targetKey: string) => {
          if (targetKey === getters.chatActorKey) return true;
          const characterList = rootGetters.getMapObjectList({
            kind: "character"
          });
          if (getters.chatActorKey.split("-")[0] === "player") {
            const targetCharacter = characterList
              .filter(
                (character: any) => character.owner === getters.chatActorKey
              )
              .filter((character: any) => character.key === targetKey)[0];
            if (targetCharacter) return true;
          } else if (getters.chatActorKey.split("-")[0] === "character") {
            const targetCharacter = characterList.filter(
              (character: any) => character.key === getters.chatActorKey
            )[0];
            if (targetCharacter) return true;
          }
          return false;
        });
        if (filterObj.length > 0) return true;
      });
    },
    createInputtingMsg: (
      state: any,
      getters: any,
      rootState: any,
      rootGetters: any
    ) => (name: string) => `${rootGetters.getViewName(name)}が入力中...`,
    chatTargetList: (
      state: any,
      getters: any,
      rootState: any,
      rootGetters: any
    ) => {
      return [
        ...getters.groupTargetTabList,
        ...rootGetters.playerList,
        ...rootGetters.getMapObjectList({ kind: "character", place: "field" })
      ];
    },
    mapMaskIsLock: (
      state: any,
      getters: any,
      rootState: any,
      rootGetters: any
    ) => {
      if (!getters.isWindowOpen("private.display.mapMaskContext")) {
        return false;
      }
      const obj = rootGetters.getObj(rootGetters.mapMaskContextObjKey);
      return obj ? obj.isLock : false;
    }
  }
};
