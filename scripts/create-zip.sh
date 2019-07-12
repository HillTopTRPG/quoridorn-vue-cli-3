#/bin/bash

# バージョン番号を指定してzipファイルを生成するスクリプト

read VERSION_NUM

ZIP_NORMAL="quoridorn-$VERSION_NUM"
ZIP_GZ="quoridorn-$VERSION_NUM-gz"

echo $ZIP_NORMAL
echo $ZIP_GZ

if [ ! -f "dist" ];
then
  echo "dist folder is not found."
  exit 1
fi

cp -r dist ZIP_NORMAL
cp -r dist ZIP_GZ
