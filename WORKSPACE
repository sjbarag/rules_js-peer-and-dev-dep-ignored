load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

http_archive(
    name = "aspect_rules_js",
    sha256 = "7cb2d84b7d5220194627c9a0267ae599e357350e75ea4f28f337a25ca6219b83",
    strip_prefix = "rules_js-1.29.2",
    url = "https://github.com/aspect-build/rules_js/releases/download/v1.29.2/rules_js-v1.29.2.tar.gz",
)

load("@aspect_rules_js//js:repositories.bzl", "rules_js_dependencies")

rules_js_dependencies()

load("@rules_nodejs//nodejs:repositories.bzl", "DEFAULT_NODE_VERSION", "nodejs_register_toolchains")

nodejs_register_toolchains(
    name = "nodejs",
    node_version = DEFAULT_NODE_VERSION,
)

load("@aspect_rules_js//npm:repositories.bzl", "npm_translate_lock")

npm_translate_lock(
    name = "npm",
    pnpm_lock = "//pkg:pnpm-lock.yaml",
    npmrc = "//pkg:.npmrc",
    data = [
        "//pkg/pad-surround:package.json",
        "//pkg/consumes-ps:package.json",
    ],
    verify_node_modules_ignored = "//:.bazelignore",
)

load("@npm//:repositories.bzl", "npm_repositories")

npm_repositories()