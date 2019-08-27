import { DiceSystem, Volatile, VolatileDice } from "@/store/Type_Volatile";
import { getFileNameArgList, getUrlParam } from "@/components/common/Utility";

type Dispatch = (target: string, payload?: any) => Promise<any>;
type Commit = (target: string, payload?: any) => any;

/**
 * 起動時に呼ばれる関数
 *
 * @param dispatch
 * @param state
 * @param rootState
 * @param rootGetters
 * @param commit
 */
export async function onMount({
  dispatch,
  state,
  rootState,
  rootGetters,
  commit
}: {
  dispatch: Dispatch;
  state: Volatile;
  rootState: any;
  rootGetters: any;
  commit: Commit;
}): Promise<any> {
  /* ----------------------------------------------------------------------
   * URLパラメータの処理
   */
  let roomName: string | null = getUrlParam("roomName");
  const roomPassword: string | null = getUrlParam("roomPassword");
  const playerName: string | null = getUrlParam("playerName");
  const playerPassword: string | null = getUrlParam("playerPassword");
  let playerType: string | null = getUrlParam("playerType");
  let system: string | null = getUrlParam("system");

  if (roomName && roomName.endsWith(rootGetters.entranceRoomName)) {
    alert(`「${rootGetters.entranceRoomName}」で終わる部屋名は使えません。`);
    roomName = null;
  }

  state.param.roomName = roomName;
  state.param.roomPassword = roomPassword;
  state.param.playerName = playerName;
  state.param.playerPassword = playerPassword;
  // 選択肢と一致していれば、権限をセットする
  if (
    rootGetters.roles.findIndex((role: any) => role.value === playerType) >= 0
  ) {
    state.param.playerType = playerType;
  } else {
    playerType = null;
  }
  state.param.system = system;

  /* ------------------------------
   * URLを書き換える（リロードなし）
   */
  const paramList = [];
  if (state.param.roomName !== null)
    paramList.push(`roomName=${state.param.roomName}`);
  if (state.param.roomPassword !== null)
    paramList.push(`roomPassword=${state.param.roomPassword}`);
  if (state.param.system !== null)
    paramList.push(`system=${state.param.system}`);
  if (state.param.playerName !== null)
    paramList.push(`playerName=${state.param.playerName}`);
  if (state.param.playerPassword !== null)
    paramList.push(`playerPassword=${state.param.playerPassword}`);
  if (state.param.playerType !== null)
    paramList.push(`playerType=${state.param.playerType}`);
  const newUrl = `?${paramList.join("&")}`;
  window.history.replaceState("", "", newUrl);

  // state_settingの初期化
  commit("init_state_setting");

  dispatch("onTest").then();

  /* ----------------------------------------------------------------------
   * 初期表示画面の設定
   */
  setTimeout(() => {
    dispatch("windowOpen", "private.display.chatWindow").then();
    dispatch("windowOpen", "private.display.initiativeWindow").then();
    // dispatch("windowOpen", "private.display.resourceWindow");
    // dispatch("windowOpen", "private.display.chatPaletteWindow");
    // dispatch("windowOpen", "private.display.publicMemoWindow");
    // dispatch("windowOpen", "private.display.playerBoxWindow");
    dispatch("windowOpen", "private.display.welcomeWindow").then();
  }, 0);

  const loadYaml: Function = rootGetters.loadYaml;

  /* ----------------------------------------------------------------------
   * ダイスの設定
   */
  state.dice = (await loadYaml("/static/conf/dice.yaml")) as VolatileDice;

  /* ----------------------------------------------------------------------
   * カード情報の設定
   */
  const cardSetName = null;
  // const cardSetName = "花札";
  // const cardSetName = "トランプ"
  // const cardSetName = "タロット"

  const deckList: any[] = await loadYaml("/static/conf/deck.yaml");
  const cardSet: any = deckList.filter((cs: any) => cs.name === cardSetName)[0];
  if (cardSet) {
    const basePath = cardSet.basePath || "";
    const storeDeck = rootState.public.deck;
    storeDeck.name = cardSet.name;
    storeDeck.back = basePath + cardSet.back;
    storeDeck.width = cardSet.width || 128;
    storeDeck.height = cardSet.height || 192;
    cardSet.source = cardSet.source || {};
    storeDeck.author = cardSet.source.author || "";
    storeDeck.title = cardSet.source.title || "";
    storeDeck.refs = cardSet.source.refs || [];
    storeDeck.cards.list = cardSet.cards.map((card: any, i: number) => ({
      key: `card-${i}`,
      front: { text: "" },
      back: { text: "", img: basePath + card.file }
    }));
    storeDeck.cards.maxKey = cardSet.cards.length - 1;
  }

  /* ----------------------------------------------------------------------
   * BGMの設定
   */
  const bgmList: any[] = await loadYaml("/static/conf/bgm.yaml");
  bgmList.forEach((bgm: any, index: number) => (bgm.key = `bgm-${index}`));
  rootState.public.bgm.list = bgmList;
  rootState.public.bgm.maxKey = bgmList.length - 1;

  /* ----------------------------------------------------------------------
   * 画像の設定
   */
  const imageList: any[] = await loadYaml("/static/conf/image.yaml");
  imageList.forEach((image: any, index: number) => {
    image.key = `image-${index}`;
    image.name = image.data.replace(/.*\//, "");

    const imageArgList = getFileNameArgList(image.name);
    if (imageArgList.length) image.imageArgList = imageArgList;

    const regExp = new RegExp("[ 　]+", "g");
    const tagStrList = image.tag.split(regExp);
    tagStrList.forEach((tagStr: string) => {
      const imageTag = rootGetters.imageTagList.filter(
        (imageTag: any) => imageTag.name === tagStr
      )[0];
      if (!imageTag) {
        const nextNum = ++rootState.public.image.tags.maxKey;
        rootState.public.image.tags.list.push({
          key: `imgTag-${nextNum}`,
          name: image.tag
        });
      }
    });
  });
  rootState.public.image.list = imageList;
  rootState.public.image.maxKey = imageList.length - 1;

  /* ----------------------------------------------------------------------
   * チャットフォーマットの設定
   */
  const chatFormatList: any[] = await loadYaml("/static/conf/chatFormat.yaml");
  chatFormatList.forEach((chatFormat: any) => {
    rootState.setting.chatFormat.targetList.push({
      label: chatFormat.label,
      chatText: chatFormat.chatText
    });
  });

  /* ----------------------------------------------------------------------
   * 接続設定の設定
   */
  const setting: any = await loadYaml("/static/conf/connect.yaml");
  rootState.setting.connect.skywayKey = setting.skywayKey;
  rootState.setting.connect.type = setting.type;
  rootState.setting.connect.bcdiceServer = setting.bcdiceServer;

  /* ----------------------------------------------------------------------
   * ダイスシステムの検証
   */
  const systemList: DiceSystem[] = await dispatch("getBcdiceSystemList").catch(
    () => {
      alert(
        `BCDice-apiサーバ\n${setting.bcdiceServer}\nの接続に失敗しました。`
      );
    }
  );
  state.chat.diceSystemList = systemList;
  const index = systemList.findIndex(
    (systemObj: any) => systemObj.system === system
  );
  if (index === -1) system = "DiceBot";

  /* ----------------------------------------------------------------------
   * 初期入室の処理
   */
  if (roomName) {
    /* ------------------------------
     * 部屋存在チェック
     */
    dispatch("loading", true).then();

    const endLoading: Function = () => dispatch("loading", false);

    await dispatch("simpleJoinRoom", { roomName: roomName }).catch(
      () => endLoading
    );
    const isExist: boolean = await dispatch("checkRoomName", {
      roomName: roomName
    }).catch(() => endLoading);
    const baseArg: any = {
      roomName,
      roomPassword,
      playerName,
      playerPassword,
      playerType,
      fontColor: "#000000",
      system,
      isWait: false
    };
    // 「新しい部屋をつくる」画面で入力される項目が指定されていれば新規部屋作成を試みる
    if (
      !isExist &&
      roomPassword !== null &&
      playerName &&
      playerPassword !== null &&
      playerType !== null
    ) {
      baseArg.playerType = baseArg.playerType || "PL";
      await dispatch("doNewRoom", baseArg).catch(() => endLoading);
    }
    // 「この部屋に入る」画面で入力される項目が指定されていれば既存部屋への入室を試みる
    if (isExist && roomPassword !== null) {
      baseArg.useWindow = true;
      baseArg.useAlert = true;
      await dispatch("doJoinRoom", baseArg).catch(() => endLoading);
    }
    endLoading();
  }
}
