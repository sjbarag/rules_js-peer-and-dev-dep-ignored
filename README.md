`rules_js` doesn't link peer+dev dependency of linked 1st-party dependency

## The Setup
Two (contrived) first-party packages are created here:

1. `pad-surround`, which depends on `left-pad` as a `peerDependency` and a `devDependency` to pad a string on both sides.
2. `consumes-ps` consumes `@…/pad-surround`, and decelares a full `dependency` on `left-pad`.

Testing `@…/consumes-ps` is the issue here. When it imports ``

Listing `left-pad` as either a `devDependency` in `@…/pad-surround` keeps `left-pad` from being a "phantom dependency" from `rules_js`'s perspective. In fact, removing either the `devDependency` or the `peerDependency` in this case causes `left-pad` to be properly linked by `rules_js`. But having both causes it to be not linked at all!

## Expected Behavior
`left-pad` is available to `@…/pad-surround` when used as a first-party dependency via Bazel, and both `pnpm --dir pkg/ test` and `bazel test //pkg:test` succeed.

## Actual Behavior
`left-pad` isn't available to `@…/pad-surround` when used as a first-party dependency via Bazel.

`pnpm --dir pkg/ test` succeeds, but `bazel test //pkg:test` fails with "Cannot find module 'left-pad'".

```
==================== Test output for //pkg/consumes-ps:test:
node:internal/modules/cjs/loader:998
  throw err;
  ^

Error: Cannot find module 'left-pad'
Require stack:
- /home/user/.cache/bazel/_bazel_user/63e3e3aa6370ea79e47a9e6c126bb41a/sandbox/linux-sandbox/465/execroot/__main__/bazel-out/k8-fastbuild/bin/pkg/consumes-ps/test.sh.runfiles/__main__/pkg/node_modules/.aspect_rules_js/@cockroachlabs+pad-surround@0.0.0/node_modules/pad-surround/index.js
- /home/user/.cache/bazel/_bazel_user/63e3e3aa6370ea79e47a9e6c126bb41a/sandbox/linux-sandbox/465/execroot/__main__/bazel-out/k8-fastbuild/bin/pkg/consumes-ps/test.sh.runfiles/__main__/pkg/consumes-ps/index.js
- /home/user/.cache/bazel/_bazel_user/63e3e3aa6370ea79e47a9e6c126bb41a/sandbox/linux-sandbox/465/execroot/__main__/bazel-out/k8-fastbuild/bin/pkg/consumes-ps/test.sh.runfiles/__main__/pkg/consumes-ps/index.test.js
    at Function.Module._resolveFilename (node:internal/modules/cjs/loader:995:15)
    at Function.Module._load (node:internal/modules/cjs/loader:841:27)
    at Module.require (node:internal/modules/cjs/loader:1067:19)
    at require (node:internal/modules/cjs/helpers:103:18)
    at Object.<anonymous> (/home/user/.cache/bazel/_bazel_user/63e3e3aa6370ea79e47a9e6c126bb41a/sandbox/linux-sandbox/465/execroot/__main__/bazel-out/k8-fastbuild/bin/pkg/consumes-ps/test.sh.runfiles/__main__/pkg/node_modules/.aspect_rules_js/@cockroachlabs+pad-surround@0.0.0/node_modules/pad-surround/index.js:1:17)
    at Module._compile (node:internal/modules/cjs/loader:1165:14)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1219:10)
    at Module.load (node:internal/modules/cjs/loader:1043:32)
    at Function.Module._load (node:internal/modules/cjs/loader:878:12)
    at Module.require (node:internal/modules/cjs/loader:1067:19) {
  code: 'MODULE_NOT_FOUND',
  requireStack: [
    '/home/user/.cache/bazel/_bazel_user/63e3e3aa6370ea79e47a9e6c126bb41a/sandbox/linux-sandbox/465/execroot/__main__/bazel-out/k8-fastbuild/bin/pkg/consumes-ps/test.sh.runfiles/__main__/pkg/node_modules/.aspect_rules_js/@cockroachlabs+pad-surround@0.0.0/node_modules/pad-surround/index.js',
    '/home/user/.cache/bazel/_bazel_user/63e3e3aa6370ea79e47a9e6c126bb41a/sandbox/linux-sandbox/465/execroot/__main__/bazel-out/k8-fastbuild/bin/pkg/consumes-ps/test.sh.runfiles/__main__/pkg/consumes-ps/index.js',
    '/home/user/.cache/bazel/_bazel_user/63e3e3aa6370ea79e47a9e6c126bb41a/sandbox/linux-sandbox/465/execroot/__main__/bazel-out/k8-fastbuild/bin/pkg/consumes-ps/test.sh.runfiles/__main__/pkg/consumes-ps/index.test.js'
  ]
}
```

## Versions
```
$ pnpm version
{
  ui: '1.0.0',
  npm: '8.19.4',
  node: '16.20.0',
  v8: '9.4.146.26-node.26',
  uv: '1.43.0',
  zlib: '1.2.11',
  brotli: '1.0.9',
  ares: '1.19.0',
  modules: '93',
  nghttp2: '1.47.0',
  napi: '8',
  llhttp: '6.0.10',
  openssl: '1.1.1t+quic',
  cldr: '41.0',
  icu: '71.1',
  tz: '2022f',
  unicode: '14.0',
  ngtcp2: '0.8.1',
  nghttp3: '0.7.0'
}

$ pnpm --version
8.6.6

$ bazel --version
bazel 6.2.1

rules_js version:
  Repro's on 1.29.2 and 1.26.1. Other versions seem likely.

platform:
  linux x86_64
```

## Repro Steps
1. Clone this repo
2. Run `pnpm --dir pkg install` to install dependencies
3. `pnpm --dir pkg test` to run tests outside of Bazel
4. `bazel test //pkg:test` to run tests in Bazel
