<template>
  <spec-frame property="initiativeWindow" label-str="イニシアティブ画面" lastVersion="1.0.0b6" :isSpecFixed="false">
    <!----------------------
     ! 起動操作
     !--------------------->
    <spec-item class-str="operation" label-str="起動操作">
      <li>画面上部メニューの「表示」を選択</li>
      <li>「ウィンドウ」にカーソルをあてる</li>
      <li>「イニシアティブ表示」を選択</li>
    </spec-item>
    <!----------------------
     ! 仕様
     !--------------------->
    <spec-item class-str="spec" label-str="仕様">
      <li>キャラクター１体に関するパラメータを表形式で表示する</li>
      <li>パラメータ名は「設定」ボタンを押下して「イニシアティブ表設定」画面で指定する</li>
      <li>列の区切り線をドラッグすることで列幅を調整可能</li>
      <li>「戦闘開始」ボタンを押下することでラウンド／手番の管理の開始</li>
      <li>「戻る」「次へ」ボタンを押下することでラウンド／手番の操作</li>
      <li>選択した行に対応するキャラクターの操作（「変更」ボタン）</li>
      <li>行の選択時に対応するキャラクターのコマを強調表示</li>
      <li>パラメータの状態をコマに反映</li>
    </spec-item>
    <!----------------------
     ! ユーザ要望
     !--------------------->
    <spec-item class-str="request" label-str="ユーザ要望">
      <li>列をダブルクリックで幅を自動調整したい<br>→ 列と列の間の仕切り線をダブルクリックで自動調整とする</li>
      <li>縮小版／全体表示とを切り替えたらどうか<br>→ 切り替えるボタンを用意</li>
      <li>選択したキャラクターに関する表示を下につけたらどうか<br>→ 実装してみたい</li>
      <li>「手番」を観点とした見た目が欲しい<br>→ いずれ必ず実装したい</li>
    </spec-item>
    <!----------------------
     ! 未実装事項
     !--------------------->
    <spec-item class-str="unImplemented" label-str="未実装事項">
      <li>「戦闘開始」ボタンを押下することでラウンド／手番の管理の開始</li>
      <li>「戻る」「次へ」ボタンを押下することでラウンド／手番の操作</li>
      <li>選択した行に対応するキャラクターの操作（「変更」ボタン）</li>
      <li>行の選択時に対応するキャラクターのコマを強調表示</li>
      <li>パラメータの状態をコマに反映</li>
      <li>選択したキャラクターに関する表示を下につけたらどうか</li>
      <li>「手番」を観点とした見た目が欲しい</li>
    </spec-item>
    <!----------------------
     ! 実装しない機能
     !--------------------->
    <spec-item class-str="unSupport" label-str="実装しない機能">
      <li>行をダブルクリックで対応するキャラクターを画面中央に表示する機能</li>
    </spec-item>
    <!----------------------
     ! 関連項目
     !--------------------->
    <spec-item class-str="ref" label-str="関連項目">
      <li><SpecLink property="menuBar" title-str="">メインメニュー</SpecLink></li>
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
