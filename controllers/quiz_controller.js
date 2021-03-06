﻿var models = require('../models/models.js'); 

// Autoload - factoriza el código si ruta incluye :quizId 
exports.load = function(req, res, next, quizId) { 
  models.Quiz.find({
  									where: { id: Number(quizId) },
  									include: [{ model: models.Comment }]
  								}
  ).then( 
    function(quiz) { 
      if (quiz) { 
        req.quiz = quiz; 
        next(); 
       } else { next(new Error('No existe quizId=' + quizId)); } 
     } 
   ).catch(function(error) { next(error);}); 
}; 
 
// GET /quizes 
exports.index = function(req, res) {
	 var w={order: [['tema','ASC']]};
	 if(req.query.search !=="" && req.query.search !== undefined) w = {where: ["pregunta like ?", '%'+req.query.search.replace(/ /g,'%')+'%'], order: [['tema','ASC']]};
   models.Quiz.findAll(w).then( 
     function(quizes) { 
       res.render('quizes/index', { quizes: quizes, errors: []}); 
     } 
   ).catch(function(error) { console.log(error); next(error);}) 
}; 
 

// GET /quizes/:id 
exports.show = function(req, res) { 
   res.render('quizes/show', { quiz: req.quiz, errors: []}); 
}; 

// GET /quizes/:id/answer 
exports.answer = function(req, res) { 
   var resultado = 'Incorrecto'; 
   if (req.query.respuesta === req.quiz.respuesta) { 
     resultado = 'Correcto'; 
   } 
   res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []}); 
};

// GET /quizes/new
exports.new = function(req, res) { 
   var quiz = models.Quiz.build(//crea objeto Quiz
   		{tema: "otros", pregunta: "Pregunta", respuesta: "Respuesta"}
   );
   res.render('quizes/new', {quiz: quiz, errors: []}); 
};

// GET /quizes/create
exports.create = function(req, res){
   var quiz = models.Quiz.build( req.body.quiz);
   quiz.validate().then(
   		function(err){
   			if(err){
   				res.render('quizes/new', {quiz: quiz, errors: err.errors});
   			}
   			else{
   				quiz.save({fields: ["tema", "pregunta", "respuesta"]}).then(function(){
   					res.redirect('/quizes');
   				});
   			}
   		});
};

// GET /quizes/:id/edit 
exports.edit = function(req, res) { 
   var quiz = req.quiz; //autoload de instancia de quiz
   res.render('quizes/edit', {quiz: quiz, errors: []}); 
};
// PUT /quizes/:id
exports.update = function(req, res) {
  req.quiz.tema  = req.body.quiz.tema;
  req.quiz.pregunta  = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;

  req.quiz.validate().then(
    function(err){
      if (err) {
        res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
      } else {
        req.quiz     // save: guarda campos pregunta y respuesta en DB
        .save( {fields: ["tema", "pregunta", "respuesta"]})
        .then( function(){ res.redirect('/quizes');});
      }
    }
  ).catch(function(error){next(error)});
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
  req.quiz.destroy().then(
    function(){
    	res.redirect('/quizes');
    }
  ).catch(function(error){next(error)});
};