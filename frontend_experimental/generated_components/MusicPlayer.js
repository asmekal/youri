import React, { useState, useEffect } from 'react';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [audioContext, setAudioContext] = useState(null);
  const [source, setSource] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [canvasContext, setCanvasContext] = useState(null);

  useEffect(() => {
    const audioCtx = new AudioContext();
    const sourceNode = audioCtx.createBufferSource();
    const analyserNode = audioCtx.createAnalyser();
    const canvasCtx = document.getElementById('canvas').getContext('2d');

    setAudioContext(audioCtx);
    setSource(sourceNode);
    setAnalyser(analyserNode);
    setCanvasContext(canvasCtx);

    sourceNode.connect(analyserNode);
    analyserNode.connect(audioCtx.destination);

    fetch('https://example.com/music.mp3')
      .then(response => response.arrayBuffer())
      .then(buffer => audioCtx.decodeAudioData(buffer))
      .then(decodedData => sourceNode.buffer = decodedData)
      .catch(error => console.error(error));
  }, []);

  const handlePlayPause = () => {
    if (isPlaying) {
      source.stop();
      setIsPlaying(false);
    } else {
      source.start();
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
    source.gain.value = volume;
  };

  const drawVisualization = () => {
    if (canvasContext && analyser) {
      const bufferLength = analyser.frequencyBinCount;
      const data = new Uint8Array(bufferLength);

      analyser.getByteFrequencyData(data);

      canvasContext.clearRect(0, 0, 200, 100);
      canvasContext.fillStyle = 'rgb(255, 255, 255)';
      canvasContext.fillRect(0, 0, 200, 100);

      canvasContext.fillStyle = 'rgb(0, 0, 255)';
      canvasContext.beginPath();

      for (let i = 0; i < bufferLength; i++) {
        const x = i * 200 / bufferLength;
        const y = 100 - (data[i] * 100 / 256);
        canvasContext.lineTo(x, y);
      }

      canvasContext.stroke();
    }

    requestAnimationFrame(drawVisualization);
  };

  useEffect(() => {
    drawVisualization();
  }, [canvasContext, analyser]);

  return (
    <div>
      <canvas id="canvas" width="200" height="100" style={{ border: '1px solid black' }} />
      <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
      <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} />
    </div>
  );
};

export default MusicPlayer;