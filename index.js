//importa o modulo "express" para criar o servidor e manipular rotas
const express = require('express')

//importa o método 'uuidv4' da biblioteca 'uuid' (que gera um identificador unico)
const {v4: uuidv4}= require('uuid')

//criar uma instancia do aplicativo express
const app= express()

//configurar o servidor para aceitar requisições com dados JSON no corpo
app.use(express.json())

//array onde armazenaremos temporariamente os projetos criados 
const projects = []

//Middleware que registra as rotas e métodos das requisções no console
function logRoutes(request,response,next){
//extrai o método e a URL da requisição 
const {method,url} = request   
//formata uma string com  método e URL
const route= '[${method.toUpperCas()}]${url}'
//exibe a string no console
console.log(route)
//executa o próximo middleware ou rota
return next()
}

//habilita o uso do middleware de log de rotas em todas as requições 

//Rota para obter a lista de projetos
app.get('/projects', function(request, response){
//retorna o array de projetos como resposta em formato JSON
return response.json(projects) 


})

//rota para adicionar um novo projeto, com middleware 
app.post('/projects',logRoutes,function(request, response)
{

//extrair 'nome' e 'resposável' do corpo da requisição
const{nome, responsável} = request.body
//cria um novo projeto com ID único, nome e responsável
const project = {

    id:uuidv4(),
    nome, 
    responsável
}
//adicionar o novo projeto ao array de projetos 
projects.push(project)

//retorna o projeto criado
return response.status(201).json(project)
})

//rota para atualizar um projeto existente elo 'id'
app.put('projects/:id', function(request, response){
//extrai o id dos parametros da URL 
const {id} = request.params
//extrai o nome e o responsável do corpo da requisição 
const{nome, responsável} = request.body
//encontre o índice do projeto no array que tem o ID igual ao passado
const projectIndex = projects.findIndex(p=> p.id===id)

//verifica se o projeto existe, senão , retorna um erro 404
if(projectIndex < 0 ){
return response.status(404).json({error: 'project not found'}) 

}
//verificar se o nome e o resposável foram informados, senão, retorna um erro 400

if(!nome || !responsável){
    return response.status(400).json({error: 'nome e responsável são necessários'})
}


//criar o novo objeto do projeto com os dados atualizados 


const project = {
id,
nome,
responsavel

}

//atualizar o projeto dentro da array
project[projectIndex]=project

//retorna o projeto ataulizado
return response.json(project)

})

//rota para deletar  projeto via 
app.delete('/project/id', function(request, response){
//extrai o id dos parametros da URL 
const {id} = request.params
//extrai o nome e o responsável do corpo da requisição 
const{nome, responsável} = request.body
//encontre o índice do projeto no array que tem o ID igual ao passado
const projectIndex = projects.findIndex(p=> p.id===id)

//verifica se o projeto existe, senão , retorna um erro 404
if(projectIndex < 0 ){
return response.status(404).json({error: 'project not found'}) 

}
//verificar se o nome e o resposável foram informados, senão, retorna um erro 400

if(!nome || !responsável){
    return response.status(400).json({error: 'nome e responsável são necessários'})
}
//remove o project do array
project.splice(projectIndex,1)

//retorna uma resposta com status 204(sem conteúdo)
return response.status(204).send()

})

//configurando o servidor na porta respectiva
app.listen(3000,()=> {
console.log("servidor iniciado na porta 3000!😁 ")
})