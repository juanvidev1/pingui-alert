import { build, emptyDir } from "dnt";

await emptyDir("./npm");

await build({
  entryPoints: ["../client/mod.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  package: {
    // package.json properties
    name: "pingui-alert",
    version: Deno.args[0],
    description: "Pingui Alert is a simple alert system for your applications.",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/juanvicentereyes/pingui-alert.git",
    },
    bugs: {
      url: "https://github.com/juanvicentereyes/pingui-alert/issues",
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("../README.md", "npm/README.md");
    Deno.copyFileSync("../LICENSE.md", "npm/LICENSE.md");
  },
});