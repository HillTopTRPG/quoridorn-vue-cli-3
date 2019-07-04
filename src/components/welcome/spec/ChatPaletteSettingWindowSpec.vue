<template>
  <spec-frame
    property="chatPaletteSettingWindowSpec"
    label-str="チャットパレット"
    lastVersion="1.0.0b14"
    :isSpecFixed="false"
  >
    <!----------------------
     ! 起動操作
     !--------------------->
    <spec-item class-str="operation" label-str="起動操作">
      <li>チャット画面のアイコン<span class="icon-list2"></span>をクリック</li>
    </spec-item>
    <!----------------------
     ! 仕様
     !--------------------->
    <spec-item class-str="spec" label-str="仕様 - 操作">
      <li>
        表示するパレット数を選ぶ
      </li>
      <li>
        アクターを選択する
      </li>
      <li>編集ボタンやセーブ・ロードをして利用する文を設定する</li>
      <li>
        表示されている行をダブルクリックでチャットに即反映
      </li>
      <li>（ワンクリックで画面上部の入力欄で編集可能状態になる）</li>
    </spec-item>
    <!----------------------
     ! 仕様
     !--------------------->
    <spec-item class-str="spec" label-str="仕様 - 詳細">
      <li>
        ロードできるフォーマット<br />
        ・Quoridornでセーブしたチャパレデータ(jsonファイル)<br />
        ・どどんとふでセーブしたチャパレデータ(cpdファイル)<br />
        ・テキストデータ(txtファイル)<br />
      </li>
      <li>
        どどんとふと同じ変数処理が可能
      </li>
      <li>
        自動連投機能<br />
        1つのタブとして実装し、各行を一定時間おきに自動でチャットに流す機能
      </li>
    </spec-item>
    <!----------------------
     ! ユーザ要望
     !--------------------->
    <spec-item class-str="request" label-str="ユーザ要望">
      <li>複数のチャパレを同時に使いたい</li>
      <li>タブは斜め表示可能にして欲しい</li>
    </spec-item>
    <!----------------------
     ! 未実装事項
     !--------------------->
    <spec-item class-str="unImplemented" label-str="未実装事項">
      <li>どどんとふと同じ変数処理<br />→ いずれ実装</li>
      <li>自動連投機能<br />→ いずれ実装</li>
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
    </spec-item>
  </spec-frame>
</template>

<script>
import SpecMixin from "./SpecMixin";
export default { mixins: [SpecMixin] };
</script>

<style scoped src="./spec.css"></style>
