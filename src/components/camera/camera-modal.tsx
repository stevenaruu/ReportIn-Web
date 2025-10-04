import React, { useRef, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { X, Camera, RotateCcw, Check } from 'lucide-react'
import { usePrimaryColor } from '@/lib/primary-color'

interface CameraModalProps {
  isOpen: boolean
  onClose: () => void
  onCapture: (file: File) => void
}

const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  const { BACKGROUND_PRIMARY_COLOR } = usePrimaryColor();
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false)

  // Check if device has multiple cameras
  useEffect(() => {
    const checkCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter(device => device.kind === 'videoinput')
        setHasMultipleCameras(videoDevices.length > 1)
      } catch (err) {
        console.error('Error checking cameras:', err)
      }
    }
    
    if (isOpen) {
      checkCameras()
    }
  }, [isOpen])

  // Start camera when modal opens, facing mode changes, or when retaking photo
  useEffect(() => {
    const startCamera = async () => {
      if (!isOpen || capturedImage) return

      setIsLoading(true)
      setError(null)
      
      try {
        // Stop existing stream first
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track: MediaStreamTrack) => track.stop())
          streamRef.current = null
        }

        const constraints = {
          video: {
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 1280 },
          },
          audio: false
        }

        const newStream = await navigator.mediaDevices.getUserMedia(constraints)
        streamRef.current = newStream

        if (videoRef.current) {
          videoRef.current.srcObject = newStream
        }
      } catch (err) {
        console.error('Error accessing camera:', err)
        setError('Could not access camera. Please check permissions.')
      } finally {
        setIsLoading(false)
      }
    }

    startCamera()
  }, [isOpen, facingMode, capturedImage])

  // Cleanup stream when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track: MediaStreamTrack) => track.stop())
      }
    }
  }, [])

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    // Set canvas dimensions to be square (1:1)
    const size = Math.min(video.videoWidth, video.videoHeight)
    canvas.width = size
    canvas.height = size

    // Calculate crop position to center the image
    const x = (video.videoWidth - size) / 2
    const y = (video.videoHeight - size) / 2

    // Draw the cropped image
    ctx.drawImage(video, x, y, size, size, 0, 0, size, size)

    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8)
    setCapturedImage(imageDataUrl)

    // Stop camera stream after capturing to save resources
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track: MediaStreamTrack) => track.stop())
      streamRef.current = null
    }
  }

  const confirmCapture = () => {
    if (!capturedImage) return

    // Convert data URL to File
    fetch(capturedImage)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], `camera-capture-${Date.now()}.jpg`, {
          type: 'image/jpeg'
        })
        onCapture(file)
        handleClose()
      })
      .catch(err => {
        console.error('Error converting image:', err)
        setError('Error processing image')
      })
  }

  const retakePhoto = () => {
    // Stop current stream when retaking
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track: MediaStreamTrack) => track.stop())
      streamRef.current = null
    }
    setCapturedImage(null)
    setError(null)
  }

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user')
  }

  const handleClose = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track: MediaStreamTrack) => track.stop())
    }
    streamRef.current = null
    setCapturedImage(null)
    setError(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-auto bg-white">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Take Photo</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="p-1 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Camera Preview or Captured Image */}
          <div className="relative mb-4">
            <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden relative">
              {error ? (
                <div className="w-full h-full flex items-center justify-center text-red-500 text-sm text-center p-4">
                  {error}
                </div>
              ) : capturedImage ? (
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
                  />
                  {isLoading && (
                    <div style={BACKGROUND_PRIMARY_COLOR(0.7)} className="absolute inset-0 bg-opacity-50 flex items-center justify-center">
                      <div className="text-white text-sm">Loading camera...</div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Switch Camera Button - Only show if multiple cameras and not captured */}
            {hasMultipleCameras && !capturedImage && !error && (
              <Button
                variant="outline"
                size="sm"
                onClick={switchCamera}
                className="absolute top-2 right-2 p-2 h-8 w-8 bg-white bg-opacity-90 hover:bg-opacity-100"
                disabled={isLoading}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {capturedImage ? (
              <>
                <Button
                  variant="outline"
                  onClick={retakePhoto}
                  className="flex-1"
                >
                  Retake
                </Button>
                <Button
                  onClick={confirmCapture}
                  style={BACKGROUND_PRIMARY_COLOR(0.7)}
                  className="flex-1 text-white"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Use Photo
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={capturePhoto}
                  disabled={isLoading || !!error}
                  className="flex-1 text-white"
                  style={BACKGROUND_PRIMARY_COLOR(0.7)}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Capture
                </Button>
              </>
            )}
          </div>

          {/* Help Text */}
          <p className="text-xs text-gray-500 text-center mt-3">
            {capturedImage
              ? 'Review your photo and use it or retake'
              : 'Position your subject in the frame and tap capture'
            }
          </p>
        </CardContent>
      </Card>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}

export default CameraModal