#!/bin/sh
# Local dev overrides (untracked). Source this instead of local_config.sh.
. ./local_config.sh
# Use a dedicated, freshly-created database for local development.
export DJ_DB_NAME="hedonometer"
# Ensure the Postgres.app client/libs are on PATH.
export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH"
