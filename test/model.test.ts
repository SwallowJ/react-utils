// import loadModel from "../lib/model/index.js";
import { loadModel } from "../es/index";

// const loadModel = require("../lib/index.js")

loadModel({ pages: "test/src/pages", customes: ["test/src/models"], output: "dist/model.ts" });
