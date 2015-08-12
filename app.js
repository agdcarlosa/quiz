/*
Ampliación opcional: Añadir una página de estadisticas
  

Las personas interesadas en practicar más con express y MVC, pueden añadir una página de estadisticas. 
La página de estadisticas estará accesible directamente desde la barra de navegación y mostrará las siguientes informaciones extraidas de la base de datos:
 El número de preguntas
 Quiz.count().then(function (count){
          if(count === 0) {   // la tabla se inicializa solo si está vacía 
 El número de comentarios totales
 Comment.count().then(function (count){
          if(count === 0) {   // la tabla se inicializa solo si está vacía 
 El número medio de comentarios por pregunta
 
 El número de preguntas sin comentarios
 
 El número de preguntas con comentarios

Para implementar esta funcionalidad habra que crear una nueva entrada en el interfaz REST de quizes asociada a la ruta: GET /quizes/statistics

 Además habra que crear un nuevo controlador que extraiga la información de la base de datos y una nueva vista que la presente.

 Una vez realizado habra que guardar esta funcionalidad en una nueva versión (commit). a continuación se desplegará la rama en heroku y se subirá a GitHub.
sequelize.query("select division_id, (modules.user_id) as modules_taken, ROUND(avg(scores.score),2) as average_score from " +                 "user join " +                 "(select user_id, score from test_score " +                 "UNION ALL " +                 "select user_id, score from task_score WHERE status_id = 1 " +                 ") as scores " +                 "  on user.id = scores.user_id " +                     "  join ( " +                     "      SELECT user_id FROM test_score " +                     "  UNION all " +                     "  SELECT user_id FROM task_score WHERE status_id NOT IN (3) " +                     "  UNION all " +                     "  SELECT user_id FROM elearning_score " +                     "  union all" +                     "  SELECT user_id FROM academy_screening " +                     "  union all" +                     "  SELECT user_id FROM academy_evaluation " +                     "  union all " +                     "  select user_id FROM academy_survey " +                     "  union al " +                     "  select user_id FROM offline_score " + "  ) as modules on user.id = modules.user_id WHERE division_id = " + user_id +"  group by division_id", {type: sequelize.QueryTypes.SELECT})     .then(onSuccess).error(onError)

//esta consulta va ok en sqlite
SELECT COUNT(N_Preguntas) AS N_Preguntas,SUM(N_Comentarios) AS N_Comentarios, 
CAST(SUM(N_Comentarios) AS REAL)/COUNT(N_Preguntas) AS Media,
SUM(Preg_Sin) AS Preg_Sin, SUM(Preg_Con) AS Preg_Con FROM (
SELECT COUNT(DISTINCT Quizzes.id) AS N_Preguntas,COUNT(Comments.id) AS N_Comentarios ,
CASE WHEN Comments.QuizId IS NULL THEN 1 ELSE 0 END AS Preg_Sin,
CASE WHEN Comments.QuizId IS NULL THEN 0 ELSE 1 END AS Preg_Con
FROM Quizzes LEFT JOIN Comments ON Quizzes.id=Comments.QuizId
GROUP BY Quizzes.id) 
*/

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
	if(req.session.user){
		var ahora = new Date();
		if(!req.session.t_inactivo){
			req.session.t_inactivo=ahora;
		}
		else if( ((ahora-(new Date(req.session.t_inactivo)))/1000) > (2*60) ){
			delete req.session.user; 
			delete req.session.t_inactivo; 
			console.log("SESSION AUTO ENDS");
		}
		else req.session.t_inactivo=ahora;
	}
	next();
});

app.use(function(req, res, next) {
	//guardar path en session.redir para despues de login o logout
	if(!req.path.match(/\/login|\/logout/)){
		req.session.redir=req.path;
	}
	//hacer visible req.session en las vistas
	res.locals.session=req.session;
	next();
});
	
	app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
