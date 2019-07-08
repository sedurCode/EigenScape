var foaRenderer;
var audioSources = {
  'Beach': 'Beach.1.1.wav',
  'Park': 'Park.3.3.wav'
};
var buttonPlayback, selectSource, buttonBypass;
var rotationMatrix3 = new Float32Array(9);
var onLoad = function () {
  var audioContext = new AudioContext();
  var audioElement = document.createElement('audio');
  var audioElementSource =
      audioContext.createMediaElementSource(audioElement);
  audioElement.loop = true;
  audioElement.crossOrigin = 'anonymous';
  audioElement.src = audioSources['Beach'];
  eRangeGain.oninput = onGainSliderChange;
  eRangeAzimuth.oninput = onDirectionChange;
  eRangeElevation.oninput = onDirectionChange;
  foaRenderer = Omnitone.createFOARenderer(audioContext, {
    // The example audio is in the FuMa ordering (W,X,Y,Z). So remap the
    // channels to the ACN format.
    // channelMap: [0, 3, 1, 2]
    channelMap: [0, 1, 2, 3]
  });

  selectSource = document.getElementById('eSelectSource');
  buttonPlayback = document.getElementById('eButtonPlayback');
  buttonBypass = document.getElementById('eButtonBypass');

  selectSource.onchange = function (event) {
    audioElement.src = audioSources[event.target.value];
    audioElement.load();
    if (buttonPlayback.textContent === 'Pause')
      audioElement.play();
  };

  buttonPlayback.onclick = function (event) {
    if (event.target.textContent === 'Play') {
      event.target.textContent = 'Pause';
      audioContext.resume();
      audioElement.play();
    } else {
      event.target.textContent = 'Play';
      audioElement.pause();
      audioContext.suspend();
    }
  };

  buttonBypass.onclick = function (event) {
    if (event.target.textContent === 'Ambisonic') {
      event.target.textContent = 'Bypass';
      foaRenderer.setRenderingMode('bypass');
    } else {
      event.target.textContent = 'Ambisonic';
      foaRenderer.setRenderingMode('ambisonic');
    }
  };

  foaRenderer.initialize().then(function () {
    selectSource.disabled = false;
    buttonPlayback.disabled = false;
    buttonBypass.disabled = false;
    audioElementSource.connect(foaRenderer.input);
    foaRenderer.output.connect(audioContext.destination);
  }, function (onInitializationError) {
    console.error(onInitializationError);
  });
};
function crossProduct(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  }

   function normalize(a) {
     var n = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
     a[0] /= n;
     a[1] /= n;
     a[2] /= n;
     return a;
   }

  function onDirectionChange() {
    // if (!exampleInitialized)
    //   return;

    var azimuthValue =
        parseFloat(document.getElementById('eRangeAzimuth').value);
    var elevationValue =
        parseFloat(document.getElementById('eRangeElevation').value);
    document.getElementById('eLabelAzimuth').textContent = azimuthValue;
    document.getElementById('eLabelElevation').textContent = elevationValue;

    // Standard OpenGL-style "View" Matrix calculation.
    var theta = azimuthValue / 180 * Math.PI;
    var phi = elevationValue / 180 * Math.PI;
    var forward = [
      Math.sin(theta) * Math.cos(phi),
      Math.sin(phi),
      Math.cos(theta) * Math.cos(phi)
    ];
    var upInitial = [0, 1, 0];
    var right = normalize(crossProduct(forward, upInitial));
    var up = normalize(crossProduct(right, forward));
    rotationMatrix3[0] = right[0];
    rotationMatrix3[1] = right[1];
    rotationMatrix3[2] = right[2];
    rotationMatrix3[3] = up[0];
    rotationMatrix3[4] = up[1];
    rotationMatrix3[5] = up[2];
    rotationMatrix3[6] = forward[0];
    rotationMatrix3[7] = forward[1];
    rotationMatrix3[8] = forward[2];
    foaRenderer.setRotationMatrix3(rotationMatrix3);
  }

  function onGainSliderChange() {
    if (!exampleInitialized)
      return;

    document.getElementById('eLabelGain').textContent = eRangeGain.value;
    inputGain.gain.value = Math.pow(10, parseFloat(eRangeGain.value) / 20);
  }
window.addEventListener('load', onLoad);
