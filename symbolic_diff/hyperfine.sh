#!/bin/env bash

hyperfine --warmup 1 \
    "$1 arrays-tag-inline.js" \
    "$1 fields-same-shape-0-fill.js" \
    "$1 fields-same-shape-undef-fill.js" \
    "$1 fields.js" \
    "$1 numbered-fields.js"
