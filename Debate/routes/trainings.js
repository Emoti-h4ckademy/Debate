var express = require('express');
var TrainingCtrl = require('../controllers/training');
var router = express.Router();
var config = require('config');

/* GET home page. */
router.get('/trainings', function(req, res) {
  TrainingCtrl.getTrainings(function (error, trainings){
    if(error){
      console.log(JSON.stringify(error));
      res.status(500).json(error);
    } else {
      res.render('trainings', {trainings : trainings});
    }
  });
});

/***************** REST API **************************************************/
/* GET a training by id. */
router.get('/training/:id', function(req, res) {
  var trainingId = req.params.id;

    TrainingCtrl.getTrainingById(trainingId, function(error, training){
      if(error){
        console.log(JSON.stringify(error));
        res.status(500).json(error);
      } else {
        res.json(proyectos);
      }
    });
});

/* POST a training. */
router.post('/training', function(req, res) {
  var name = req.body.name;

    TrainingCtrl.create(name, function(error, training){
      if(error){
        console.log(JSON.stringify(error));
        res.status(500).json(error);
      } else {
        res.json(training);
      }
    });
});


module.exports = router;
