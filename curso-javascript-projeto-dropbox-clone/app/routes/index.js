var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.delete("/file", (req,res)=>{
    //Aqui é definido o diretorio que o upload será recebido.
    let form = new formidable.IncomingForm({
      uploadDir: './upload',
      keepExtensions: true
    });
  
    /*
      Aqui, o que é recebido é interpretado(parse)  e é feito a separação de campos e files. 
      Nesse caso, só é nos interessa fields.
    */
    form.parse(req, (err, fields, files)=>{
      
      let path = "./"+ fields.path ;
      if(fs.existsSync(path)){
        fs.unlink(path, err=>{
          if(err)
            res.status(400).json({err});
          else
            res.json({fields});
        });
      }
      
    });
  
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
