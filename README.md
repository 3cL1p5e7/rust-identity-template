# Rust + Typescript + Internet Identity template example. Powered by [Dfinity](https://dfinity.org/)

This repository is a customized example for Dfinity, Typescript and Rust development. Not quite optimal, not quite pretty, but working. Just take and use.

You can easily deploy a local network and log in through the Internet identity.

Special thanks to [Dfinity/CanCan](https://github.com/dfinity/cancan)

## Quickstart
```bash
sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

./run.sh
```

### Quickstop :)
```bash
dfx stop
```

## Quickstart with explaination

Initialize Internet Identity submodule

```bash
git submodule init
git submodule update
```

Install requirements such as internet-computer SDK and rust (with wasm support)

```bash
sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add wasm32-unknown-unknown
```

To start network with internet-identity (first launch will be long ~ 10min)

```bash
./run.sh
```

To stop network
```bash
dfx stop
```

If backend canister updated
```bash
dfx deploy backend
```

## Local development

Start network
```bash
./run.sh
```

Start frontend and open [http://localhost:3000](localhost:3000)
```
npm run dev
```


## Technical area
Manual start internet identity

```bash
cd internet-identity
II_ENV=development dfx deploy --no-wallet --argument '(null)'
echo "http://localhost:8000?canisterId=$(dfx canister id internet_identity)"
```

Find process by error "Address in use"

```bash
ps aux | grep dfx
```
