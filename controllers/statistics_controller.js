var models = require('../models/models.js'); 

// GET /statistics 
exports.index = function(req, res) {
   var sql ='SELECT COUNT(N_Preguntas) AS N_Preguntas,SUM(N_Comentarios) AS "N_Comentarios",CAST(SUM(N_Comentarios) AS REAL)/COUNT(N_Preguntas) AS "Media",SUM(Preg_Sin) AS "Preg_Sin", SUM(Preg_Con) AS "Preg_Con" FROM (SELECT COUNT(DISTINCT "Quizzes".id) AS N_Preguntas,COUNT("Comments".id) AS N_Comentarios,CASE WHEN "Comments"."QuizId" IS NULL THEN 1 ELSE 0 END AS Preg_Sin,CASE WHEN "Comments"."QuizId" IS NULL THEN 0 ELSE 1 END AS Preg_Con FROM "Quizzes" LEFT JOIN "Comments" ON "Quizzes".id="Comments"."QuizId" GROUP BY "Quizzes".id,"Comments"."QuizId") A';
   models.sequelize.query(sql).then( 
     function(statistics) { 
       res.render('statistics', { statistics: statistics, errors: []}); 
     } 
   ).catch(function(error) { console.log(error); next(error);}) 
}; 