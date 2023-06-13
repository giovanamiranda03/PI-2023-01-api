import { randomUUID } from "node:crypto";
import { Database } from "../database.js";
import { buildRoutePath } from "../utils/build-route-path.js";

const database = new Database();

export default [
  {
    method: "GET",
    path: buildRoutePath("/usuarios"),
    handler: (req, res) => {
      try {
        const data = database.select("usuarios");
        res.end(JSON.stringify(data));
      } catch (error) {
        res.writeHead(500).end(JSON.stringify({ error: "Erro interno do servidor" }));
      }
    },
  },
  {
    method: "GET",
    path: buildRoutePath("/usuarios/:id"),
    handler: (req, res) => {
      try {
        const { id } = req.params;
        const data = database.select("usuarios", { id });
        res.end(JSON.stringify(data));
      } catch (error) {
        res.writeHead(500).end(JSON.stringify({ error: "Erro interno do servidor" }));
      }
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/usuarios"),
    handler: (req, res) => {
      try {
        const { nome, email, senha } = req.body;
  
        if (!nome || !senha || !email) {
          res.writeHead(400).end(JSON.stringify({ error: "Campos obrigatórios faltando" }));
          return;
        }
  
        const usuario = {
          id: randomUUID(),
          nome,
          email,
          senha,
          created_at: new Date(),
          update_at: new Date(),
        };
        database.insert("usuarios", usuario);
        res.writeHead(201).end(JSON.stringify(usuario));
      } catch (error) {
        res.writeHead(500).end(JSON.stringify({ error: "Erro interno do servidor" }));
      }
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/login"),
    handler: (req, res) => {
      try {
        const { email, senha } = req.body;
        const data = database.select("usuarios", { email, senha });
  
        if (data.length > 0) {
          res.writeHead(200).end(JSON.stringify(data[0]));
        } else {
          res.writeHead(403).end();
        }
      } catch (error) {
        res.writeHead(500).end(JSON.stringify({ error: "Erro interno do servidor" }));
      }
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/usuarios/:id"),
    handler: (req, res) => {
      try {
        const { id } = req.params;
        database.delete("usuarios", id);
        res.writeHead(204).end();
      } catch (error) {
        res.writeHead(500).end(JSON.stringify({ error: "Erro interno do servidor" }));
      }
    },
  },
];

