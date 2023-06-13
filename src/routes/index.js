import { buildRoutePath } from "../utils/build-route-path.js";
import imagens from "./imagens.js";
import imoveis from "./imoveis.js";
import usuarios from "./usuarios.js";

export default [
  {
    method: "GET",
    path: buildRoutePath("/status"),
    handler: (req, res) => {
      console.log("aqui");
      return res.end(JSON.stringify({ status: "OK" }));
    },
  },
  ...imoveis,
  ...imagens,
  ...usuarios,
];
