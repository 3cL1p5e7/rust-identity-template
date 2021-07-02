#!/bin/bash
set -e

git submodule init
git submodule update
rustup target add wasm32-unknown-unknown

rm -rf ./.dfx
npm install

dfx stop
dfx start --background --clean

cd ./internet-identity
rm -rf ./.dfx
npm install

II_ENV=development dfx deploy --no-wallet --argument '(null)'
echo "http://localhost:8000?canisterId=$(dfx canister id internet_identity)"

cd ..
dfx deploy
open http://localhost:8000?canisterId=$(dfx canister id assets)