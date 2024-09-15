import React, { useRef, useEffect, useState } from 'react';

const CameraApp = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  useEffect(() => {
    if (isCameraOn) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [isCameraOn]);

  // Function to start the camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error('Error accessing webcam: ', err);
    }
  };

  // Function to stop the camera
  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
    videoRef.current.srcObject = null;
  };

  // Function to take a snapshot and automatically download the image
  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    // Generate image data URL
    const photoData = canvas.toDataURL('image/png');

    // Generate timestamp-based filename
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
    const photoFileName = `photo_${timestamp}.png`;

    // Automatically trigger download
    const link = document.createElement('a');
    link.href = photoData;
    link.download = photoFileName;
    document.body.appendChild(link); // Append the link to the document
    link.click(); // Simulate click to download the file
    document.body.removeChild(link); // Remove the link after download
  };

  return (
    <div className="container">
      <h1>Camera App</h1>

      {/* Video element to show live camera feed */}
      <video
        ref={videoRef}
        autoPlay
        width="640"
        height="480"
        style={{ border: '1px solid black' }}
      ></video>

      {/* Canvas to capture the image */}
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

      <div className="button-container">
        {/* Button to turn the camera on/off */}
        <button onClick={() => setIsCameraOn(!isCameraOn)}>
          {isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
        </button>

        {/* Button to capture a photo */}
        {isCameraOn && (
          <button onClick={capturePhoto} style={{ marginLeft: '10px' }}>
            Take Snapshot
          </button>
        )}
      </div>
    </div>
  );
};

export default CameraApp;
