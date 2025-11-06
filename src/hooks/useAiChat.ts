'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Message } from '@/lib/types'
import useSound from 'use-sound'
import axios from 'axios'

export function useAiChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(() => uuidv4())
  const [isListening, setIsListening] = useState(false)
  const [micVolume, setMicVolume] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<any>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const dataArrayRef = useRef<Uint8Array | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  const [playRecordStart] = useSound('/sounds/start.mp3', { volume: 0.3 })
  const [playRecordEnd] = useSound('/sounds/end.mp3', { volume: 0.3 })
  // const [playMessageSent] = useSound(
  //   '/sounds/beep.mp3',
  //   { volume: 0.25 }
  // )
  // const [playResponseComplete] = useSound(
  //   '/sounds/completed.mp3',
  //   { volume: 0.3 }
  // )

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        window.SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'en-US'

        recognitionRef.current.onerror = (event: any) => {
          setError(event.error)
          setIsListening(false)
          stopVolumeMonitoring()
        }
      } else {
        setError('not-supported')
      }
    }
  }, [])

  const startVolumeMonitoring = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)()
      const source = audioContext.createMediaStreamSource(stream)
      analyserRef.current = audioContext.createAnalyser()
      analyserRef.current.fftSize = 256
      source.connect(analyserRef.current)

      dataArrayRef.current = new Uint8Array(
        analyserRef.current.frequencyBinCount
      )

      const updateVolume = () => {
        if (analyserRef.current && dataArrayRef.current) {
          analyserRef.current.getByteFrequencyData(dataArrayRef.current)
          const average =
            dataArrayRef.current.reduce((a, b) => a + b) /
            dataArrayRef.current.length
          setMicVolume(Math.min(average / 255, 1))
          animationFrameRef.current = requestAnimationFrame(updateVolume)
        }
      }
      updateVolume()
    } catch (error) {
      console.error('Error accessing microphone:', error)
      setError('audio-capture')
    }
  }, [])

  const stopVolumeMonitoring = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    setMicVolume(0)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Send message to AI
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return

      // Check if playMessageSent is available before calling
      // if (playMessageSent) {
      //   playMessageSent()
      // }

      const userMessage: Message = {
        id: uuidv4(),
        content,
        role: 'user',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

      try {
        const response = await axios.post('/api/ai/chat', {
          message: userMessage,
          sessionId,
        })

        const data = response.data

        const assistantMessage: Message = {
          id: uuidv4(),
          content: data.response,
          role: 'assistant',
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, assistantMessage])

        // if (playResponseComplete) {
        //   playResponseComplete()
        // }
      } catch (error) {
        console.error('Error sending message:', error)
        setError('network')
      } finally {
        setIsLoading(false)
      }
    },
    [sessionId]
  )

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError('not-supported')
      return
    }

    // Clear any previous errors
    clearError()

    if (playRecordStart) {
      playRecordStart()
    }

    startVolumeMonitoring()
    setIsListening(true)

    recognitionRef.current.onstart = () => setIsListening(true)
    recognitionRef.current.onend = () => {
      setIsListening(false)
      stopVolumeMonitoring()
    }
    
    recognitionRef.current.onresult = (event: any) => {
      let interimTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          sendMessage(transcript)
        } else {
          interimTranscript += transcript
        }
      }
    }

    try {
      recognitionRef.current.start()
    } catch (err) {
      console.error('Error starting speech recognition:', err)
      setError('audio-capture')
      setIsListening(false)
      stopVolumeMonitoring()
    }
  }, [
    sendMessage,
    playRecordStart,
    startVolumeMonitoring,
    stopVolumeMonitoring,
    clearError,
  ])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      if (playRecordEnd) {
        playRecordEnd()
      }
      stopVolumeMonitoring()
      setIsListening(false)
    }
  }, [playRecordEnd, stopVolumeMonitoring])

  const clearChat = useCallback(() => {
    setMessages([])
    clearError()
  }, [clearError])

  return {
    messages,
    isLoading,
    isListening,
    micVolume,
    error,
    sendMessage,
    startListening,
    stopListening,
    clearError,
    clearChat,
  }
}
