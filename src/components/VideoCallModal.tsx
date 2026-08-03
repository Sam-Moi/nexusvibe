import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface VideoCallProps {
  roomId: string;
  onClose: () => void;
}

const configuration: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun1.l.google.com:19302' }, // Free public Google STUN server
  ],
};

export const VideoCallModal: React.FC<VideoCallProps> = ({ roomId = "default-call-room", onClose }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callStatus, setCallStatus] = useState('Connecting...');

 useEffect(() => {
  let isCancelled = false;
  const iceCandidatesQueue: RTCIceCandidateInit[] = [];

  const socket = io((import.meta as any).env?.VITE_SERVER_URL || 'http://localhost:3000');
  socketRef.current = socket;

  const pc = new RTCPeerConnection(configuration);
  peerConnectionRef.current = pc;

  // 1. Join room immediately
  socket.emit('join-room', roomId);

  // 2. Local Media
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((stream) => {
      if (isCancelled) return;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      stream.getTracks().forEach((track) => {
        if (pc.signalingState !== 'closed') {
          pc.addTrack(track, stream);
        }
      });
    })
    .catch((err) => console.error("Camera access error:", err));

  // 3. Remote Media
  pc.ontrack = (event) => {
    if (remoteVideoRef.current && event.streams[0]) {
      remoteVideoRef.current.srcObject = event.streams[0];
      setCallStatus('Connected');
    }
  };

  // 4. Send ICE Candidates
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit('ice-candidate', { roomId, candidate: event.candidate });
    }
  };

  // 5. Handshake triggered ONLY when 2 users are present
  socket.on('ready', async () => {
    // First client creates the offer
    if (pc.signalingState === 'closed') return;
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit('offer', { roomId, offer });
    } catch (err) {
      console.error("Offer creation error:", err);
    }
  });

  socket.on('offer', async ({ offer }) => {
    if (pc.signalingState === 'closed') return;
    try {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      
      // Process queued candidates
      while (iceCandidatesQueue.length > 0) {
        const cand = iceCandidatesQueue.shift();
        if (cand) await pc.addIceCandidate(new RTCIceCandidate(cand));
      }

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('answer', { roomId, answer });
    } catch (err) {
      console.error("Offer handling error:", err);
    }
  });

  socket.on('answer', async ({ answer }) => {
    if (pc.signalingState === 'closed') return;
    try {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));

      // Process queued candidates
      while (iceCandidatesQueue.length > 0) {
        const cand = iceCandidatesQueue.shift();
        if (cand) await pc.addIceCandidate(new RTCIceCandidate(cand));
      }

      setCallStatus('Connected');
    } catch (err) {
      console.error("Answer handling error:", err);
    }
  });

  socket.on('ice-candidate', async ({ candidate }) => {
    if (!candidate || pc.signalingState === 'closed') return;
    try {
      if (pc.remoteDescription && pc.remoteDescription.type) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } else {
        iceCandidatesQueue.push(candidate);
      }
    } catch (err) {
      console.error("ICE candidate error:", err);
    }
  });

  return () => {
    isCancelled = true;
    socket.disconnect();
    pc.close();
  };
}, [roomId]);

  // Toggle Mute Audio
  const toggleMic = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicMuted(!audioTrack.enabled);
      }
    }
  };

  // Toggle Camera Off
  const toggleVideo = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">
        {/* Status Header */}
        <div className="absolute top-4 left-4 z-10 bg-black/60 px-3 py-1 rounded-full text-xs text-zinc-300">
          {callStatus}
        </div>

        {/* Video Screens */}
        <div className="relative w-full h-[450px] bg-black flex items-center justify-center">
          {/* Remote Video (Full Screen) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Local Video (Self View - Picture in Picture) */}
          <div className="absolute bottom-4 right-4 w-36 h-48 bg-zinc-800 rounded-xl overflow-hidden border-2 border-zinc-700 shadow-lg">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Call Controls */}
        <div className="flex items-center justify-center gap-6 p-4 bg-zinc-900">
          <button
            onClick={toggleMic}
            className={`p-3 rounded-full transition ${
              isMicMuted ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
            }`}
          >
            {isMicMuted ? '🎙️ Unmute' : '🎙️ Mute'}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full transition ${
              isVideoOff ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
            }`}
          >
            {isVideoOff ? '📹 Turn On Cam' : '📹 Turn Off Cam'}
          </button>

          <button
            onClick={onClose}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full shadow-lg transition"
          >
            📵 End Call
          </button>
        </div>
      </div>
    </div>
  );
};