<template>
  <spec-frame
    property="saveMapWindow"
    label-str="マップ状態保存"
    lastVersion="1.0.0b1"
    :isSpecFixed="true"
  >
    <!----------------------
     ! 起動操作
     !--------------------->
    <spec-item class-str="operation" label-str="起動操作">
      <li>画面上部メニューの「マップ」を選択</li>
      <li>「マップ状態保存」を選択</li>
    </spec-item>
    <!----------------------
     ! 仕様
     !--------------------->
    <spec-item class-str="spec" label-str="仕様">
      <li>
        現在のマップの状態をセーブデータとして保存する
      </li>
      <li>
        保存時に追加で含めるデータを以下の中から選択可能
        <ol>
          <li>フロアタイル</li>
          <li>マップマスク</li>
          <li>簡易マップ</li>
        </ol>
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
      <li>
        本機能自体が未実装
        <br />→ 初回リリースには含めない。しばらくは運用でカバーをお願いします。
      </li>
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
        <spec-link property="menuBar" title-str="">メインメニュー</spec-link>
      </li>
    </spec-item>
  </spec-frame>
</template>

<script>
import SpecMixin from "./SpecMixin";
export default { mixins: [SpecMixin] };
</script>

<style scoped src="./spec.css"></style>
