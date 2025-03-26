class DropBoxController{

    constructor(){
      
      this.btnSendFileEl = document.querySelector('#btn-send-file');
      this.inputFilesEl = document.querySelector('#files');
      this.snackModalEl = document.querySelector('#react-snackbar-root');
      this.progressBarEl = this.snackModalEl.querySelector(".mc-progress-bar-fg");
      this.namefileEl = this.snackModalEl.querySelector(".filename");
      this.timeleftEl = this.snackModalEl.querySelector(".timeleft");

      this.initEvents();  
    }

    initEvents(){
        this.btnSendFileEl.addEventListener('click', event =>{
            this.inputFilesEl.click();
        });
        this.inputFilesEl.addEventListener('change', event =>{
            this.uploadTask(event.target.files);
            this.showUploadBar();
            this.inputFilesEl.value = '';
        });
    }

    showUploadBar(show = true){
        if(show)
            this.snackModalEl.style.setProperty('display', 'block', 'important');
        else
            this.snackModalEl.style.setProperty('display', 'none');

    }


    uploadTask(files){

        let promises = [];

        [...files].forEach(file=>{
            promises.push(new Promise((resolve, reject)=>{

                let ajax = new XMLHttpRequest();
                ajax.open('POST', '/upload');

                ajax.onload = event =>{

                    this.showUploadBar(false);
                    try{
                        resolve(JSON.parse(ajax.responseText));
                    }catch(e){
                        reject(e);
                    }
                };
                ajax.onerror =  event =>{
                    this.showUploadBar(false);  
                    reject(event); 
                };

                //Capturando o progresso do Upload para atulizar a barra de upload(react-snack)
                ajax.upload.onprogress = event =>{
                    this.uploadProgress(event, file);
                    console.log(event);
                };

                let formData = new FormData();
                formData.append('input-file', file);

                this.startUploadTime = Date.now();
                ajax.send(formData);

            }));
        });

        return Promise.all(promises);
    }

    uploadProgress(event, file ){

        ///Quantos de bits foram enviados a té o momento
        let loaded = event.loaded;
        //Quantiade total que bits que precisam ser enviados
        let total = event.total;
        //Fazendo a porcentagem disso
        let porcent = parseInt((loaded / total) * 100);
        //Capturando o momento do upload e diminuindo com o momento que o processo começou
        let timeSpent = Date.now() - this.startUploadTime;
        //Regra de três para calcular quanto tempo irá faltar(timeLeft) com base no tempo decorrido entre os uploads(timeSpent)
        let timeLeft = ((100 - porcent) * timeSpent) / porcent;
        //Colocando a porcentagem no elemento correto na view no hmtl.
        this.progressBarEl.style.width = `${porcent}%`;
        //Colocando o nome do arquivo no elemento correto na view no hmtl.
        this.namefileEl.innerHTML = file.name;
        //Colocando o tempo de upload elemento correto na view no hmtl.
        this.timeleftEl.innerHTML =  this.formatTimeLeftUpload(timeLeft) ;      
    }

    //Formatando o tempo com base no tempo decorrido.
    formatTimeLeftUpload(duration){
      let seconds = parseInt((duration/1000) % 60);
      let minutes = parseInt((duration/(1000 * 60)) % 60); 
      let hours = parseInt((duration/(1000 * 60 * 60)) % 24); 
      let timeLeftFormated ;

      if(hours > 0)
        return `${hours} horas, ${minutes} minutos e ${seconds} segundos`;
      if(minutes>0)
        return `${minutes} minutos e ${seconds} segundos`;
      if(seconds > 0)
        return `${seconds} segundos`;

      return 0;
    }

}

