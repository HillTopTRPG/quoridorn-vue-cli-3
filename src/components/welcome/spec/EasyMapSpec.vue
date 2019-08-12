<template>
  <spec-frame
    property="easyMapSpec"
    label-str="簡易マップ"
    lastVersion="1.0.0"
    :isSpecFixed="true"
  >
    <!----------------------
     ! 起動操作
     !--------------------->
    <spec-item class-str="operation" label-str="起動操作">
      <li>画面上部メニューの「マップ」を選択</li>
      <li>「簡易マップ作成」を選択</li>
    </spec-item>
    <!----------------------
     ! 仕様
     !--------------------->
    <spec-item class-str="spec" label-str="仕様">
      <li>
        マス目を色(透過度つき)で塗りつぶす機能
      </li>
      <li>
        以下の３つの機能で塗りつぶし操作を行う
        <ol>
          <li>色の選択(＋透過度)</li>
          <li>ペン太さの設定</li>
          <li>鉛筆</li>
          <li>消しゴム</li>
          <li>スポイト</li>
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
        本機能自体が未実装<br />→ ちょっと大変なので初回リリースには含めない。
      </li>
    </spec-item>
    <!----------------------
     ! 実装しない機能
     !--------------------->
    <spec-item class-str="unSupport" label-str="実装しない機能">
      <li>未記載</li>
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
