var express = require('express');
var router = express.Router();
var formidable = require('formidable');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/upload', (req,res)=>{
  
  //Aqui é definido o diretorio que o upload será recebido.
  let form = new formidable.IncomingForm({
    uploadDir: './upload',
    keepExtensions: true
  });

  /*
    Aqui, o que é recebido é interpretado(parse)  e é feito a separação de campos e files. 
    Nesse caso, só é nos interessa files.
  */
  form.parse(req, (err, fields, files)=>{
    res.json({files});
  });


});

module.exports = router;
