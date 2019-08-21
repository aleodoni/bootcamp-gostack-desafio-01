const express = require("express");

const server = express();

server.use(express.json());

const projects = [];

let totRequisicoes = 0;

// Middleware Global que mostra total de requisições feitas até então
server.use((req, res, next) => {
  totRequisicoes++;
  console.log(`Total de requisições : ${totRequisicoes}`);

  return next();
});

// Middleware que verifica se o projeto com o ID recebido como parâmetro existe.
// Se não existir, retorna erro com mensagem "ID não encontrado"
function checkProjectIdExists(req, res, next) {
  const { id } = req.params;

  const projectIndex = projects.findIndex(pro => pro.id === id);
  if (projectIndex < 0) {
    return res.status(400).json({ error: "Project not found" });
  }

  return next();
}

// GET /projects - Rota que lista todos os projetos e suas tarefas
server.get("/projects", (req, res) => {
  return res.json(projects);
});

// POST /projects - Cadastra um novo projeto, recebendo id e title no corpo
server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  const newProject = {
    id: id,
    title: title,
    tasks: []
  };
  projects.push(newProject);

  return res.json(projects);
});

// PUT /projects/:id - Rota que altera apenas o título do projeto recebendo o
// id como parâmetro da rota
server.put("/projects/:id", checkProjectIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(pro => pro.id === id);
  project.title = title;

  return res.json(projects);
});

// DELETE /projects/:id - Rota que deleta o projeto com o id presente nos
// parâmetros da rota
server.delete("/projects/:id", checkProjectIdExists, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(pro => pro.id === id);

  projectIndex > -1 ? projects.splice(projectIndex, 1) : null;

  return res.json(projects);
});

// POST /projects/:id/tasks - Rota recebe campo title e armazenar nova tarefa
// no array de tarefas do projeto através do id
server.post("/projects/:id/tasks", checkProjectIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const projectIndex = projects.findIndex(pro => pro.id === id);

  projectIndex > -1 ? projects[projectIndex].tasks.push(title) : null;

  return res.json(projects[projectIndex]);
});

server.listen(3000);
