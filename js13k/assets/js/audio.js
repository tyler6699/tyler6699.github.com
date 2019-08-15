// Sound
var context = new AudioContext();
var o = null
var g = null

function playSound(name){
  m = context.createBuffer(1,96e3,48e3);
  b = m.getChannelData(0)
  for(i=96e3;i--;){
    b[i]=getSound(name,i);
  }
  s = context.createBufferSource();
  s.buffer = m;
  s.connect(context.destination);
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
