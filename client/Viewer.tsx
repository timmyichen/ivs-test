import React from 'react'
import * as IVSPlayer from 'amazon-ivs-player'

/**
 * These imports are loaded via the file-loader, and return the path to the asset.
 * We use the TypeScript compiler (TSC) to check types; it doesn't know what this WASM module is, so let's ignore the error it throws (TS2307).
 */
// @ts-ignore
import wasmBinaryPath from 'amazon-ivs-player/dist/assets/amazon-ivs-wasmworker.min.wasm';
// @ts-ignore
import wasmWorkerPath from 'amazon-ivs-player/dist/assets/amazon-ivs-wasmworker.min.js';

const PLAYBACK_URL = 'PLAYBACK_URL_HERE'

const Viewer: React.FC = () => {
  const outputRef = React.useRef<HTMLVideoElement | null>(null)
  console.log(IVSPlayer)

  const joinBroadcast = () => {
    if (IVSPlayer.isPlayerSupported) {
      const player = IVSPlayer.create({
        wasmBinary: wasmBinaryPath,
        wasmWorker: wasmWorkerPath,
      })

      player.attachHTMLVideoElement(outputRef.current!)
      player.load(PLAYBACK_URL)
      player.play()
      console.log('called play')
    }
  }
  
  return (
    <div>
      <button onClick={joinBroadcast}>Join</button>
      <video ref={outputRef}></video>
    </div>
  )
}

export default Viewer
