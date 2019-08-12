<template>
  <spec-frame
    property="chatLogSaveSpec"
    label-str="チャットログ保存機能"
    lastVersion="1.0.0"
    :isSpecFixed="true"
  >
    <!----------------------
     ! 起動操作
     !--------------------->
    <spec-item class-str="operation" label-str="起動操作１">
      <li>画面上部メニューの「ファイル」を選択</li>
      <li>「チャットログ取得」を選択</li>
    </spec-item>
    <spec-item class-str="operation" label-str="起動操作２">
      <li>
        チャット画面のアイコン<span class="icon-file-text"></span>をクリック
      </li>
    </spec-item>
    <spec-item class-str="operation" label-str="起動操作３">
      <li>チャットログ削除をする際、チャットログを保存してから削除される</li>
    </spec-item>
    <!----------------------
     ! 仕様
     !--------------------->
    <spec-item class-str="spec" label-str="仕様">
      <li>
        <b>GM限定機能</b
        >（いずれ閲覧制限などを設けてPLなどでも保存できるようにしたい）
      </li>
      <li>
        単一HTMLファイルをダウンロードする
      </li>
      <li>
        ダウンロードしたHTMLの機能を使って他の形式のログを生成する<br />（どどんとふHTML,
        どどんとふTXT, JSON）
      </li>
      <li>ログデータは暗号化する</li>
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
      <li>閲覧制限によりPLでも適切なログをダウンロードできるようにする</li>
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
