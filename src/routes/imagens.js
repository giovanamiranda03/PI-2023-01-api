import { randomUUID } from "node:crypto";
import { Database } from "../database.js";
import { buildRoutePath } from "../utils/build-route-path.js";

const database = new Database();

export default [
  {
    method: "GET",
    path: buildRoutePath("/imagens"),
    handler: (req, res) => {
      try {
        const data = database.select("imagens");
        res.end(JSON.stringify(data));
      } catch (error) {
        res.writeHead(500).end(JSON.stringify({ error: "Erro interno do servidor" }));
      }
    },
  },
  {
    method: "GET",
    path: buildRoutePath("/imagens/:id"),
    handler: (req, res) => {
      try {
        const { id } = req.params;
        const data = database.select("imagens", {
          idImovel: id,
        });
        res.end(JSON.stringify(data));
      } catch (error) {
        res.writeHead(500).end(JSON.stringify({ error: "Erro interno do servidor" }));
      }
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/imagens"),
    handler: (req, res) => {
      try {
        const { titulo, url, idImovel } = req.body;

        if (!titulo || !url || !idImovel) {
          res.writeHead(400).end(JSON.stringify({ error: "Campos obrigatórios faltando" }));
          return;
        }

        const file = {
          id: randomUUID(),
          titulo,
          url,
          idImovel,
          created_at: new Date(),
          update_at: new Date(),
        };
        database.insert("imagens", file);
        res.writeHead(201).end(JSON.stringify(file));
      } catch (error) {
        res.writeHead(500).end(JSON.stringify({ error: "Erro interno do servidor" }));
      }
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/imagens/:id"),
    handler: (req, res) => {
      try {
        const { id } = req.params;
        database.delete("imagens", id);
        res.writeHead(204).end();
      } catch (error) {
        res.writeHead(500).end(JSON.stringify({ error: "Erro interno do servidor" }));
      }
    },
  },
];

