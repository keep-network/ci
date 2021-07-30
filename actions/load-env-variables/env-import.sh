#!/bin/bash
# Exit on error
set -e

while getopts f: flag
do
    case "${flag}" in
        f) filename=${OPTARG};;
    esac
done

echo "--- Start importing variables..."
while read p || [[ -n "$p" ]]; do
  echo "---- Importing variable $p" 
  echo "$p" >> $GITHUB_ENV
done <$filename
echo "--- Done importing variables..."