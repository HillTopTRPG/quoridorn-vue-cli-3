// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'bcdice-js/lib/preload-dicebots'
import Vue from "vue";
import Vuex from "vuex";
import {
  qLog,
  toInitiativeObjList,
  arrangeInitiativeWidthList
} from "@/components/common/Utility";

Vue.use(Vuex);

/**
 * Store
 * @type { Vuex }
 */
export default {
  actions: {
    /** ========================================================================
     * 普通発言でチャットログを追加する
     */
    addSimpleChatLog: (
      { dispatch, rootGetters }: { dispatch: Function; rootGetters: any },
      {
        actorKey = rootGetters.chatActorKey,
        text,
        tab = rootGetters.activeTab,
        statusName = "◆",
        target
      }: {
        actorKey: string;
        text: string;
        tab: string;
        statusName: string;
        target: string | undefined;
      }
    ) => {
      const usePayload = {
        name: rootGetters.getViewName(actorKey),
        text,
        color: rootGetters.getChatColor(actorKey),
        tab,
        from: rootGetters.getOwnerKey(actorKey),
        actorKey,
        statusName,
        target,
        owner: actorKey
      };
      dispatch("addChatLog", usePayload);
    },
    /** ========================================================================
     * チャットログを追加する
     */
    addChatLog: ({ dispatch }: { dispatch: Function }, payload: any) => {
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
        const name = payload.name;
        const color = payload.color;
        const tab = payload.tab || activeChatTab.key;
        const from = payload.from;
        const actorKey = payload.actorKey;
        const target = payload.target;

        const actor: any = rootGetters.getObj(actorKey);
        if (actor) {
          const statusName = payload.statusName;
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
              if (index < 0) {
                standImageList.push(standImageObj);
              } else {
                standImageList.splice(index, 1, standImageObj);
              }
            }
          }
        }

        let viewHtml;
        if (target) {
          const targetName = rootGetters.getObj(target).name;
          const useTargetText = targetName === "全体" ? "" : " > " + targetName;
          viewHtml = `<span style="color: ${color};"><b>${name}${useTargetText}</b>：${text.replace(
            /\r?\n/g,
            "<br>"
          )}</span>`;
        } else {
          viewHtml = `<span style="color: ${color};"><b>${name}</b>：${text.replace(
            /\r?\n/g,
            "<br>"
          )}</span>`;
        }
        const logObj = {
          owner: payload.owner,
          target: target,
          from: from,
          viewHtml: viewHtml
        };
        // 未読カウントアップ
        if (tab !== activeChatTab.key) {
          const index = rootGetters.chatTabsOption.findIndex(
            (tabObj: any) => tabObj.key === tab
          );
          const tabObj = rootGetters.chatTabsOption[index];
          tabObj.unRead++;
          rootGetters.chatTabsOption.splice(index, 1, tabObj);
        }
        rootState.public.chat.logs[tab].push(logObj);
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
      for (const tab in rootState.public.chat.logs) {
        if (!rootState.public.chat.logs.hasOwnProperty(tab)) continue;
        const changeTab: any = {};
        change[tab] = changeTab;
        rootState.public.chat.logs[tab].forEach((log: any, index: number) => {
          if (log.owner !== target.key) return;
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
        tag,
        data,
        thumbnail,
        imageArgList,
        owner
      });
      if (rootGetters.playerKey === owner) {
        rootGetters.historyList.push({ type: "add", key: key });
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
     * BGMを追加する
     */
    addBGM: ({ dispatch }: { dispatch: Function }, payload: any) => {
      dispatch("sendNoticeOperation", { value: payload, method: "doAddBGM" });
    },
    doAddBGM: (
      { rootState, rootGetters }: { rootState: any; rootGetters: any },
      payload: any
    ) => {
      // 欠番を埋める方式は不採用
      let maxKey = rootState.public.bgm.maxKey;
      const key = `bgm-${++maxKey}`;
      rootState.public.bgm.maxKey = maxKey;
      payload.key = key;
      delete payload.ownerPeerId;
      rootState.public.bgm.list.push(payload);
      if (rootGetters.playerKey === payload.owner) {
        rootGetters.historyList.push({ type: "add", key: key });
      }
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

      dispatch("changeListInfo", {
        key: key,
        statusList: updateStatusList
      });
    },
    /** ========================================================================
     * マップオブジェクトを追加する
     */
    addPieceInfo: ({ dispatch }: { dispatch: Function }, payload: any) => {
      dispatch("sendNoticeOperation", {
        value: payload,
        method: "doAddPieceInfo"
      });
    },
    doAddPieceInfo: (
      { rootState, rootGetters }: { rootState: any; rootGetters: any },
      payload: any
    ) => {
      // 欠番を埋める方式は不採用
      let maxKey = rootState.public[payload.propName].maxKey;
      const key = `${payload.kind}-${++maxKey}`;
      rootState.public[payload.propName].maxKey = maxKey;

      const obj: any = {
        key: key,
        isDraggingLeft: false,
        move: {
          from: { x: 0, y: 0 },
          dragging: { x: 0, y: 0 },
          gridOffset: { x: 0, y: 0 }
        },
        angle: {
          total: 0,
          dragging: 0,
          dragStart: 0
        },
        isLock: false
      };

      for (let prop in payload) {
        if (!payload.hasOwnProperty(prop)) continue;
        if (prop === "isNotice") continue;
        obj[prop] = payload[prop];
      }

      const pList: string[] = [];
      pList.push(`type: ${obj.type}`);
      pList.push(`name: ${obj.name}`);
      pList.push(`key: ${obj.key}`);
      pList.push(`locate: (${obj.top}, ${obj.left})`);
      pList.push(`rows: ${obj.rows}`);
      pList.push(`cols: ${obj.columns}`);
      pList.push(`bg: "${obj.color}`);
      pList.push(`font: ${obj.fontColor}`);
      qLog(`マップオブジェクト追加 => ${pList.join(", ")}`);

      if (rootGetters.playerKey === payload.owner) {
        rootGetters.historyList.push({ type: "add", key: key });
      }
      rootState.public[payload.propName].list.push(obj);
    },
    /** ========================================================================
     * リスト情報を変更する
     */
    changeListInfo: ({ dispatch }: { dispatch: Function }, payload: any) => {
      dispatch("sendNoticeOperation", {
        value: payload,
        method: "doChangeListInfo"
      });
    },
    doChangeListInfo: (
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
     * マップオブジェクトの削除
     */
    deletePieceInfo: ({ dispatch }: { dispatch: Function }, payload: any) => {
      dispatch("sendNoticeOperation", {
        value: payload,
        method: "doDeletePieceInfo"
      });
    },
    doDeletePieceInfo: (
      { rootState, rootGetters }: { rootState: any; rootGetters: any },
      payload: any
    ) => {
      // window.console.log(`delete pieceInfo -> ${payload.propName}(${payload.key})`)
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
      rootGetters.groupTargetTab.list.push({
        key: `groupTargetTab-${++rootGetters.groupTargetTab.maxKey}`,
        isSecret: false,
        name: "",
        targetTab: null,
        isAll: false,
        group: [payload.ownerKey]
      });
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
      const lastActiveTab = rootState.public.activeChatTab;
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
        if (lastActiveTab && lastActiveTab.name === tab) {
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
          rootState.public.chat.logs = newLogs;
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
      return rootGetters.chatLogs[rootGetters.activeTab].filter((log: any) => {
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
      });
    },
    groupTargetTabList: (
      state: any,
      getters: any,
      rootState: any,
      rootGetters: any
    ) => {
      return rootGetters.groupTargetTab.list.filter((tab: any) => {
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
    createInputtingMsg: () => (name: string) => `${name}が入力中...`,
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
