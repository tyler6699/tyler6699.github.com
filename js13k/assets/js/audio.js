// Sound
var audioCtx;
var oscArr = [];

function playSound(name){
  m = audioCtx.createBuffer(1,96e3,48e3);
  b = m.getChannelData(0)
  for(i=96e3;i--;){
    b[i]=getSound(name,i);
  }
  s = audioCtx.createBufferSource();
  s.buffer = m;
  s.connect(audioCtx.destination);
  s.start();
}

getSound = function (name,i){
  var val;
  switch(name) {
  case NOISEFX:
    val = getNoise(i);
    break;
  case COINFX:
    val = getCoin(i);
    break;
  case JUMPFX:
    val = getJump(i);
    break;
  case FALLFX:
    val = getFall(i);
    break;
  default:
    return 1;
  }

  return val;
}

function getNoise(i){
  return Math.random() * 2 - 1;
}

function getJump(i){
  var n = 1e4;
  if (i>n) return null;
  var t = (n-i)/n;
  return ((Math.pow(i,1.055)&128)?1:-1)*Math.pow(t,2);
}

function getFall(i){
  var n=5e4;
  if (i > n) return null;
  var t = (n-i)/n;
  return ((Math.pow(i,0.9)&200)?1:-1)*Math.pow(t,3);
}

function getCoin(i){
  var n=1e4;
  var c=n/3;
  if (i > n) return null;
  var t = (n-i)/n;
  var q=Math.pow(t,2.1);
  return (Math.pow(i,3)&(i<c?16:99))?q:-q;
}

//https://xem.github.io/miniMusic/simple.html
function playMusic(){
  // Stop all current sounds
  for(os of oscArr){
    if(os!=null) os.stop(0);
  }
  oscArr = [];

  data = [12,12,11,11,11,10,10,10,11,11,11,12,12,12];
  audio = new AudioContext();
  for(d in data){
    if(data[d]){
      gain = audio.createGain();
      osc = audio.createOscillator();
      oscArr.push(osc);
      osc.connect(gain);
      gain.connect(audio.destination);
      osc.start(d*.4);
      osc.frequency.setValueAtTime(440*1.06 ** (13-data[d]),d*.4);
      osc.type='triangle';
      gain.gain.setValueAtTime(1,d*.4),
      gain.gain.setTargetAtTime(.0001,d*.4+.38,.005);
      osc.stop(d*.4+.39);
    }
  }
}
