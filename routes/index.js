var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});



/* GET author page. */
router.get('/author', function(req, res) {
  res.render('author', { author: 'Carlos González', img: '/images/cg.jpg' });
});

//Autoload de comandos con :quizId//
router.param('quizId', quizController.load);// autoload :quizId})d

//Definición de rutas de /quizes
router.get('/quizes',                      quizController.index);
router.get('/quizes/:quizId(\\d+)',        quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new',                  quizController.new);
router.post('/quizes/create',               quizController.create);

module.exports = router;
