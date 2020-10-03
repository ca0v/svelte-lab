import sirv from "sirv";
import polka from "polka";
import compression from "compression";
import * as sapper from "@sapper/server";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

const app = polka();
if (dev) {
  app.use(
    compression({ threshold: 0 }),
    sirv("static", { dev }),
    sapper.middleware()
  );
} else {
  app.use(
    "svelte-lab/apps/sapper-1",
    compression({ threshold: 0 }),
    sirv("static", { dev }),
    sapper.middleware()
  );
}
app.listen(PORT, (err) => {
  if (err) console.log("error", err);
});
