#!/usr/bin/env bash

ROOT=$(pwd)

xcrun safari-web-extension-converter \
  $ROOT/extension \
  --project-location $ROOT/windowed-safari-app \
  --macos-only
