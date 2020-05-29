const express = require("express");
const cors = require("cors");

 const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validIndex(request, response, next) {
  const {id } = request.params;
  const indexRepositories = repositories.findIndex(repository => repository.id === id);
  if (indexRepositories < 0) return response.status(400).send("Bad request.");
  next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;
  const newRepository = {
    id: uuid(),
    url,
    title,
    techs,
    likes: 0
  };
  repositories.push(newRepository);
  return response.send(newRepository);
});

app.put("/repositories/:id", validIndex, (request, response) => {
  const { id } = request.params;
  const { url, title, techs } = request.body;
  
  const indexRepositories = repositories.findIndex(repository => repository.id == id);

  const updateRepository = { ...repositories[indexRepositories], url, title, techs }; 
  repositories[indexRepositories] = updateRepository;
  return response.send(updateRepository);
});

app.delete("/repositories/:id", validIndex, (request, response) => {
  const { id } = request.params;
  const indexRepositories = repositories.findIndex(repository => repository.id === id);
  repositories.splice(indexRepositories, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like",validIndex, (request, response) => {
  const { id } = request.params;
  const indexRepositories = repositories.findIndex(repository => repository.id === id);
  let likes = repositories[indexRepositories].likes;
  likes++;
  repositories[indexRepositories].likes = likes;
  return response.send(repositories[indexRepositories]);
});

module.exports = app;
