import React from 'react'
import IVSBroadcastClient, { AmazonIVSBroadcastClient } from 'amazon-ivs-web-broadcast'

const INGEST_ENDPOINT = 'rtmps://1423c2b23654.global-contribute.live-video.net:443/app/'
const STREAM_KEY = 'sk_us-west-2_HusLE9oPfxIh_ZubyOux8SYvBCDZBd4YUBgkqqAzeEn'

async function handlePermissions() {
  let permissions = {
      audio: false,
      video: false,
  };
  try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      for (const track of stream.getTracks()) {
          track.stop();
      }
      permissions = { video: true, audio: true };
  } catch (err: any) {
      permissions = { video: false, audio: false };
      console.error(err.message);
  }
  // If we still don't have permissions after requesting them display the error message
  if (!permissions.video) {
      console.error('Failed to get video permissions.');
  } else if (!permissions.audio) {
      console.error('Failed to get audio permissions.');
  }

  console.log(permissions)
}

const TestComponent: React.FC = () => {
  const clientRef = React.useRef<AmazonIVSBroadcastClient | null>(null)
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)

  const onStart = async () => {
    const streamConfig = IVSBroadcastClient.BASIC_LANDSCAPE

    clientRef.current = IVSBroadcastClient.create({
      // Enter the desired stream configuration
      streamConfig,
      // Enter the ingest endpoint from the AWS console or CreateChannel API
      ingestEndpoint: INGEST_ENDPOINT,
    });

    console.log(clientRef.current)
    await handlePermissions()

    clientRef.current.attachPreview(canvasRef.current!);

    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter((d) => d.kind === 'videoinput');
    const audioDevices = devices.filter((d) => d.kind === 'audioinput');

    console.log(videoDevices, audioDevices)

    const cameraStream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: videoDevices[0].deviceId,
        width: {
          ideal: streamConfig.maxResolution.width,
          max: streamConfig.maxResolution.width,
        },
        height: {
          ideal: streamConfig.maxResolution.height,
          max: streamConfig.maxResolution.height,
        }
      }
    })
    const microphoneStream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId: audioDevices[0].deviceId },
    });

    await clientRef.current.addVideoInputDevice(cameraStream, 'camera1', { index: 0 })
    await clientRef.current.addAudioInputDevice(microphoneStream, 'mic1')

    // this will probably live on the server?
    const broadcast = await clientRef.current.startBroadcast(STREAM_KEY)
    console.log('started broadcast')
  }

  const onStop = () => {
    clientRef.current?.stopBroadcast()
  }

  return (
    <div>
      <button onClick={onStart}>Start broadcast</button>
      <canvas ref={canvasRef}></canvas>
      <button onClick={onStop}>Stop broadcast</button>
    </div>
  )
}

export default TestComponent
