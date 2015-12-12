var express = require('express');
var ProjectCtrl = require('../controllers/project');
var PersonCtrl = require('../controllers/person');
var router = express.Router();
var config = require('config');

/* GET home page. */
router.get('/proyectos', function(req, res) {
  ProjectCtrl.getProjects(function (error, allprojects){
    if(error){
      console.log(JSON.stringify(error));
      res.status(500).json(error);
    } else {
      res.render('proyectos', { proyectos : allprojects });
    }
  });
});


/* GET a project by id. */
router.get('/proyectos/:id', function(req, res) {
  var projectId = req.params.id;

    ProjectCtrl.getProjectById(projectId, function(error, project){
      if(error){
        console.log(JSON.stringify(error));
        res.status(500).json(error);
      } else {
        res.json(proyectos);
      }
    });
});

/* POST a project by id. */
router.post('/proyectos', function(req, res) {
  var name = req.body.name;

    ProjectCtrl.create(name, function(error, project){
      if(error){
        console.log(JSON.stringify(error));
        res.status(500).json(error);
      } else {
        res.json(project);
      }
    });
});


module.exports = router;
