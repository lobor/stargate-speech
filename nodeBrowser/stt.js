module.exports = function (args) {
  function stopElectronApp(){
    console.log('exit electron app');
    require('electron').remote.app.quit()
  }
  var SpeechRecognition = window.SpeechRecognition ||
                          window.webkitSpeechRecognition ||
                          window.mozSpeechRecognition ||
                          window.msSpeechRecognition ||
                          window.oSpeechRecognition;

  navigator.webkitGetUserMedia({ audio: true }, function () {
    console.log('audio ok');
    recognition = new SpeechRecognition();

    recognition.maxAlternatives = 5;
    recognition.interimResults = false;
    recognition.lang = 'fr-FR';

    recognition.onstart = function(){
      console.log('start');
    }

    recognition.onend = function(){
      console.log('end');
      stopElectronApp();
    }

    recognition.onresult = function(){
      console.log('result');
      stopElectronApp();
    }

    recognition.onerror = function(error){
      console.log('error', '=>', error.error);
      stopElectronApp();
    }

    recognition.start();
  }, function(){
    console.log('audio KO');
    stopElectronApp();
  });
}
