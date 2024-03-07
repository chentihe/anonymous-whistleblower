import express from "express"
import path from "path"
import fs from "fs"
import { loadConfig } from "./configs/config";

const main = async () => {
  const app = express()

  // setting cors
  app.use((req, res, next) => {
      res.set("access-control-allow-origin", "*")
      res.set("access-control-allow-headers", "*")
      next()
  })
  const port = process.env.PORT ?? 8000

  app.use(express.json())

  app.listen(port, () => console.log(`Listening on port ${port}`))

  // import all non-index files from this folder
  const config = await loadConfig();
  const routeDir = path.join(__dirname, 'routes');
  const routes = await fs.promises.readdir(routeDir);
  for (const routeFile of routes) {
      const { default: route } = await import(path.join(routeDir, routeFile))
      route(app, config)
  };
}

main().catch((err) => {
  console.error(`Uncaught error: ${err}`);
  process.exit(1);
});