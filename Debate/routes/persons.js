var express = require('express');
var PersonCtrl = require('../controllers/person');
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
  var person = req.body.person;

    PersonCtrl.create(person.name, person.path, function(error, person){
      if(error){
        console.log(JSON.stringify(error));
        res.status(500).json(error);
      } else {
        res.json(person);
      }
    });
});


module.exports = router;
