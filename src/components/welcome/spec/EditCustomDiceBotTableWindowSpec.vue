<template>
  <spec-frame
    property="editCustomDiceBotTableWindowSpec"
    label-str="ダイスボット表変更"
    lastVersion="1.0.0"
    :isSpecFixed="false"
  >
    <!----------------------
     ! 起動操作
     !--------------------->
    <spec-item class-str="operation" label-str="起動操作">
      <li>
        ダイスボット用表管理画面の新規作成ボタンまたはコピー作成ボタン、編集ボタンをクリック
      </li>
    </spec-item>
    <!----------------------
     ! 仕様
     !--------------------->
    <spec-item class-str="spec" label-str="仕様">
      <li>「コマンド名」はチャットに反応する文字</li>
      <li>
        「ダイス」はBCDiceが反応できるコマンド
      </li>
      <li>
        「表タイトル」はその独自ダイスボットにつける名前
      </li>
      <li>「ゲームシステム」はメモ程度の情報</li>
      <li>
        「表内容」は全角半角どちらでもいいのでコロン(：)で区切って、コロンの左が「BCDiceの結果のうち一番右の"→"の右の部分」、コロンの右がその独自ダイスボットとしての結果となるように記述していくこと。
      </li>
      <li>
        「表内容」の過分は無視され、不足分は「該当値なし」が結果となる。
      </li>
    </spec-item>
    <!----------------------
     ! ユーザ要望
     !--------------------->
    <spec-item class-str="request" label-str="ユーザ要望">
      <li>なし</li>
    </spec-item>
    <!----------------------
     ! 未実装事項
     !--------------------->
    <spec-item class-str="unImplemented" label-str="未実装事項">
      <li>なし</li>
    </spec-item>
    <!----------------------
     ! 実装しない機能
     !--------------------->
    <spec-item class-str="unSupport" label-str="実装しない機能">
      <li>なし</li>
    </spec-item>
    <!----------------------
     ! 関連項目
     !--------------------->
    <spec-item class-str="ref" label-str="関連項目">
      <li>
        <spec-link property="chatWindowSpec" title-str=""
          >チャット画面</spec-link
        >
      </li>
      <li>
        <spec-link property="customDiceBotTableWindowSpec" title-str=""
          >ダイスボット用表管理</spec-link
        >
      </li>
    </spec-item>
  </spec-frame>
</template>

<script>
import SpecMixin from "./SpecMixin";
export default { mixins: [SpecMixin] };
</script>

<style scoped src="./spec.css"></style>
