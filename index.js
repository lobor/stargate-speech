import { Plugin, error, success, warning, info } from './../../core/';

const spawn = require('child_process').spawn;

class PluginSample extends Plugin {
  get props() {
    return {
      dependencies: [],
      conf: require('./config/config')
    };
  }

  onDependencies(){

  }

  onLoad(){
    this.dependencies.server.on('onReloadServer', () => {
      this.checkPicoTTS();
    });
  }

  installPicoTTS(){
    if(this.dependencies.server.socket){
      this.dependencies.server.socket.on('askSudo:response', (data, fc) => {
        exec('echo ' + data.password + ' | sudo -S apt-get install libttspico-utils', (error, stdout, stderr) => {
          this.dependencies.server.socket.off('askSudo:response');
          if (error) {
            return;
          }
          this.start();
          fc({success: true});
        });
      });

      this.dependencies.server.socket.emit('askSudo');
    }
  }

  start(){
    var ElectronSpawn = require('electron-spawn');
    var electron = ElectronSpawn(__dirname + '/nodeBrowser/stt.js', 'bar', 'baz', {
      detached: true
    });
    electron.stderr.on('data', function (data) {
      error(data.toString())
    });
    electron.stdout.on('data', function (data) {
      info(data.toString())
    });
  }

  checkPicoTTS(){
    let which = spawn('which', ['pico2wave']);
    which.on('close', (code) => {
      if(1 === code){
        error('Sorry, this module requires libttspico-utils to be installed');
        this.installPicoTTS()
      }
      else{
        this.start();
      }
    });
  }
}


export default PluginSample;
