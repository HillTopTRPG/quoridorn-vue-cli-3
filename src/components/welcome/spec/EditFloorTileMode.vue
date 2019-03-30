<template>
  <spec-frame property="editFloorTileMode" label-str="フロアタイル変更モード" lastVersion="1.0.0b1" :isSpecFixed="true">
    <!----------------------
     ! 起動操作
     !--------------------->
    <spec-item class-str="operation" label-str="起動操作">
      <li>画面上部メニューの「マップ」を選択</li>
      <li>「フロアタイル変更モード」を選択</li>
    </spec-item>
    <!----------------------
     ! 仕様
     !--------------------->
    <spec-item class-str="spec" label-str="仕様">
      <li>このモードの最中はマップオブジェクトを全て非表示の状態にする</li>
      <li>画像とマス数だけを指定してマップに画像の被せ物ができるイメージ</li>
      <li>フロアタイルはフロアタイル変更モード中にしか編集できない</li>
      <li>フロアタイルはあらゆるマップオブジェクトより下に表示され、マップより上に表示される</li>
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
      <li>本機能自体が未実装<br>→ 初回リリースに含める機能</li>
    </spec-item>
    <!----------------------
     ! 実装しない機能
     !--------------------->
    <spec-item class-str="unSupport" label-str="実装しない機能">
      <li>どどんとふではフロアタイルがマップからはみ出て配置されても表示され、その上で操作も可能だが、Quoridornではテーブルからはみ出たら切り捨てられるものとする。</li>
    </spec-item>
    <!----------------------
     ! 関連項目
     !--------------------->
    <spec-item class-str="ref" label-str="関連項目">
      <li><spec-link property="menuBar" title-str="">メインメニュー</spec-link></li>
    </spec-item>
  </spec-frame>
</template>

<script>
import SpecMixin from "./SpecMixin";
export default { mixins: [SpecMixin] };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped src="./spec.css">
</style>
