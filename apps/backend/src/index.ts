import express from "express"
import path from "path"
import fs from "fs"
import { ethers } from "ethers";
import { Database } from "@tableland/sdk";
import { jsonFileAliases } from "@tableland/node-helpers";
import { D1Orm } from "d1-orm";
import PostDao from "./daos/PostDao";
import VoteDao from "./daos/VoteDao";
import PostService from "./services/PostService";
import VoteService from "./services/VoteService";

const loadConfig = () => {
  const pk = process.env.PRIVATE_KEY;
  if (pk == undefined) {
    throw new Error("private key is not set");
  }

  const nodeUrl = process.env.NODE_URL;
  if (nodeUrl == undefined) {
    throw new Error("node url is not set");
  }

  const provider = new ethers.providers.JsonRpcProvider(nodeUrl);

  const signer = new ethers.Wallet(pk, provider);
  
  const db = new Database({ signer, aliases: jsonFileAliases("./tableland.aliases.json") });
  const orm = new D1Orm(db);

  const postDao = new PostDao(orm);
  const voteDao = new VoteDao(orm);

  const postService = new PostService(postDao);
  const voteService = new VoteService(postDao, voteDao);

  return {
    postService: postService,
    voteService: voteService,
  };
}

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
  const config = loadConfig();
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