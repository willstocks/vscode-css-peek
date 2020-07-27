#!/bin/bash

set -eu

eval $(op signin my)

vsce publish $@

OPEN_VSX_TOKEN=$(op get item mx4i5scgxplfxclsbp5rwtpif4 --fields notesPlain)

npx ovsx publish --pat $OPEN_VSX_TOKEN