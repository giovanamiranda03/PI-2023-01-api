import { randomUUID } from "node:crypto";
import { Database } from "../database.js";
import { buildRoutePath } from "../utils/build-route-path.js";
import imagens from "./imagens.js";

const database = new Database();

export default [
  {
    method: "GET",
    path: buildRoutePath("/imoveis"),
    handler: async (req, res) => {
      try {
        const { search } = req.query;
        const imoveis = await database.select(
          "imoveis",
          search
            ? {
                $or: [
                  { titulo: search },
                  { descricao: search },
                ],
              }
            : null
        );

        const imoveisComImagens = [];

        for (const imovel of imoveis) {
          const imagens = await database.select("imagens", {
            idImovel: imovel.id,
          });
          imovel.imagens = imagens;
          imoveisComImagens.push(imovel);
        }

        res.end(JSON.stringify(imoveisComImagens));
      } catch (error) {
        res.writeHead(500).end(JSON.stringify({ error: "Erro interno do servidor" }));
      }
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/imoveis"),
    handler: async (req, res) => {
      try {
        const { titulo, descricao } = req.body;

        if (!titulo || !descricao) {
          res.writeHead(400).end(JSON.stringify({ error: "Campos obrigatórios faltando" }));
          return;
        }

        const imovel = {
          id: randomUUID(),
          titulo,
          descricao,
          imagens: [],
          created_at: new Date(),
          update_at: new Date(),
        };
        await database.insert("imoveis", imovel);

        const imagens = await database.select("imagens", {
          idImovel: imovel.id,
        });
        imovel.imagens = imagens;

        res.writeHead(201).end(JSON.stringify(imovel));
      } catch (error) {
        res.writeHead(500).end(JSON.stringify({ error: "Erro interno do servidor" }));
      }
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/imoveis/:id"),
    handler: (req, res) => {
      try {
        const { id } = req.params;
        const { titulo, descricao } = req.body;
  
        if (!titulo || !descricao) {
          res.writeHead(400).end(JSON.stringify({ error: "Campos obrigatórios faltando" }));
          return;
        }
  
        database.update("imoveis", id, {
          titulo,
          descricao,
          update_at: new Date(),
        });
        res.writeHead(204).end();
      } catch (error) {
        res.writeHead(500).end(JSON.stringify({ error: "Erro interno do servidor" }));
      }
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/imoveis/:id"),
    handler: (req, res) => {
      try {
        const { id } = req.params;
        database.delete("imoveis", id);
        res.writeHead(204).end();
      } catch (error) {
        res.writeHead(500).end(JSON.stringify({ error: "Erro interno do servidor" }));
      }
    },
  },
];

