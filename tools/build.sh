#!/bin/bash 

# ./build-frontend.sh
# ./build-backend.sh
# ./build-cli.sh
set -e

ROOT_DIR="$(cd $(dirname "${BASH_SOURCE}")/.. && pwd -P)"

function build::frontend {
    echo "building frontend"
    cd $ROOT_DIR
    yarn install
    yarn run build
}

function build::backend {
    echo "building backend"
    cd "${ROOT_DIR}/lib"
    go build 
}

function build::cli {
    echo "building backend"
    cd "${ROOT_DIR}/fleet-cli"
    go build 
}

function move::backend {
    echo "moving backend"
    cd "${ROOT_DIR}/lib"
    mv lib* "${ROOT_DIR}/build"
}

function move::cli {
    echo "moving cli"
    cd "${ROOT_DIR}/fleet-cli"
    mv fleet-cli "${ROOT_DIR}/build"
}

function parse::args {
  POSITIONAL=()
  while [[ $# -gt 0 ]]; do
    key="$1"
    case ${key} in
		--frontend-only)
		FRONTEND_ONLY=true
		shift
		;;
		--backend-only)
		BACKEND_ONLY=true
		shift
		;;
		--cli-only)
		CLI_ONLY=true
		shift
		;;
    esac
  done
  set -- "${POSITIONAL[@]}" # Restore positional parameters.
}

cd $ROOT_DIR

START=$(date +%s)

if [ "${FRONTEND_ONLY}" = true ] ; then
	build::frontend
	exit
fi

if [ "${BACKEND_ONLY}" = true ] ; then
	build::backend
	exit
fi

if [ "${CLI_ONLY}" = true ] ; then
	build::cli
	exit
fi

build::frontend

build::backend
move::backend

# build::cli
# move::cli

END=$(date +%s)
TIME=$(echo "${END} - ${START}" | bc)
echo "build finished successfully after ${TIME}s"