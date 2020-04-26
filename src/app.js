const express = require("express");
const cors = require("cors");
const Yup = require("yup")

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (req, res) => {
  return res.json(repositories)
});

app.post("/repositories", async (req, res) => {
  const schema = Yup.object().shape({
    title: Yup.string().required(),
    url: Yup.string().required(),
    techs: Yup.array().required(),
  })

  if(!(await schema.isValid(req.body))){
    return res.status(400).json({error: "Invalid or missing information!"})
  }

  const id = uuid();

  const data ={
    ...req.body,
    id,
    likes:0,
  }

  repositories.push(data);
  return res.status(200).json(data)
});

app.put("/repositories/:id", (req, res) => {
  const {id} = req.params
  const {title,url,techs} = req.body;

  const findOne = repositories.findIndex(item=>item.id=== id);
  if(findOne<0){
    return res.status(400).json({error:'Repository does not exist!'})
  }

  if(title){
    repositories[findOne].title = title;
  }
  if(url){
    repositories[findOne].url = url;
  }
  if(techs){
    repositories[findOne].techs = techs;
  }

  return res.status(200).json(repositories[findOne])

});

app.delete("/repositories/:id", (req, res) => {
  const {id} = req.params

  const findOne = repositories.findIndex(item=>item.id=== id);
  if(findOne<0){
    return res.status(400).json({error:'Repository does not exist!'})
  }

  repositories.splice(findOne,1);
  return res.status(204).json({message:'Deleted!'})
});

app.post("/repositories/:id/like", (req, res) => {
  const {id} = req.params;

  const findOne = repositories.findIndex(item=>item.id=== id);
  if(findOne<0){
    return res.status(400).json({error:'Repository does not exist!'})
  }

  repositories[findOne].likes +=1;
  return res.status(200).json({likes: repositories[findOne].likes})
});

module.exports = app;
