var express = require('express');
var PersonCtrl = require('../controllers/person');
var TrainingCtrl = require('../controllers/training');
var router = express.Router();
var config = require('config');

/* GET all persons. */
router.get('/persons', function(req, res) {
  PersonCtrl.getPersons(function (error, allpersons){
    if(error){
      console.log(JSON.stringify(error));
      res.status(500).json(error);
    } else {
      res.render('persons', { persons : allpersons });
    }
  });
});

/* POST a project*/
router.post('/person', function(req, res) {

    TrainingCtrl.addPerson(req.body.trainingId, req.body.name, req.body.directoryPath, function(error, person){
      if(error){
        console.log(JSON.stringify(error));
        res.status(500).json(error);
      } else {
        res.json(person);
      }
    });
});


module.exports = router;
