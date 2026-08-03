import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userAvatar: string;
  callType: 'voice' | 'video';
}

export const CallModal: React.FC<CallModalProps> = ({
  isOpen,
  onClose,
  userName,
  userAvatar,
  callType,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(callType === 'voice');
  const [callDuration, setCallDuration] = useState(0);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isOpen) {
      setCallDuration(0);
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      // Access camera/microphone
      navigator.mediaDevices
        .getUserMedia({ video: callType === 'video', audio: true })
        .then((stream) => {
          streamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch((err) => console.error('Error accessing media devices:', err));
    }

    return () => {
      clearInterval(timer);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, callType]);

  const toggleMute = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#12141a] border border-[#2b2d3a] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col items-center p-6 relative">
        
        {/* Status Header */}
        <div className="text-center mb-6">
          <span className="text-xs font-semibold tracking-wider text-green-400 uppercase">
            {callType === 'video' ? 'Video Call' : 'Voice Call'} • Active
          </span>
          <h3 className="text-xl font-bold text-white mt-1">{userName}</h3>
          <p className="text-xs text-gray-400 mt-1">{formatTime(callDuration)}</p>
        </div>

        {/* Video / Avatar Container */}
        <div className="relative w-full h-64 bg-[#090a0d] rounded-xl overflow-hidden flex items-center justify-center border border-[#22242e] mb-8">
          {callType === 'video' && !isVideoOff ? (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100"
            />
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative mb-3">
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-[#1e202b]"
                />
                <div className="absolute inset-0 rounded-full border-2 border-blue-500 animate-ping opacity-30" />
              </div>
              <span className="text-xs text-gray-400">Audio Only</span>
            </div>
          )}
        </div>

        {/* Action Controls Bar */}
        <div className="flex items-center space-x-6">
          <button
            onClick={toggleMute}
            className={`p-4 rounded-full transition-all ${
              isMuted
                ? 'bg-red-500/20 text-red-500 border border-red-500/50'
                : 'bg-[#1e202b] hover:bg-[#282a38] text-gray-200'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          <button
            onClick={onClose}
            className="p-5 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/40 transition-transform active:scale-95"
            title="End Call"
          >
            <PhoneOff className="w-7 h-7" />
          </button>

          {callType === 'video' && (
            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full transition-all ${
                isVideoOff
                  ? 'bg-red-500/20 text-red-500 border border-red-500/50'
                  : 'bg-[#1e202b] hover:bg-[#282a38] text-gray-200'
              }`}
              title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
            >
              {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};