'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function Translator() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [translation, setTranslation] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('hindi');
  const [isTranslating, setIsTranslating] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [browserType, setBrowserType] = useState('');
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Debug logging function
  const addDebugInfo = (message: string) => {
    console.log(message);
    setDebugInfo(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const languages = [
    { code: 'hindi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'tamil', name: 'Tamil', flag: '🇮🇳' },
    { code: 'telugu', name: 'Telugu', flag: '🇮🇳' },
    { code: 'malayalam', name: 'Malayalam', flag: '🇮🇳' },
    { code: 'bengali', name: 'Bengali', flag: '🇮🇳' },
    { code: 'kannada', name: 'Kannada', flag: '🇮🇳' },
    { code: 'marathi', name: 'Marathi', flag: '🇮🇳' },
    { code: 'gujarati', name: 'Gujarati', flag: '🇮🇳' },
  ];

  // Audio feedback functions
  const playBeep = (frequency: number = 800, duration: number = 200) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration / 1000);
    
    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration / 1000);
  };

  const playStartBeep = () => playBeep(800, 150);
  const playStopBeep = () => playBeep(400, 200);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Detect browser type
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.includes('firefox')) {
        setBrowserType('firefox');
      } else if (userAgent.includes('chrome')) {
        setBrowserType('chrome');
      } else if (userAgent.includes('edge')) {
        setBrowserType('edge');
      } else {
        setBrowserType('other');
      }

      // Check for speech recognition support
      const SpeechRecognition = (window as any).SpeechRecognition || 
                               (window as any).webkitSpeechRecognition || 
                               (window as any).mozSpeechRecognition;
      
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'en-US';
          
          // Only set maxAlternatives if supported (Chrome/Edge)
          if ('maxAlternatives' in recognition) {
            recognition.maxAlternatives = 1;
          }

          recognition.onstart = () => {
            console.log('Speech recognition started');
            setIsListening(true);
          };

          recognition.onresult = (event: any) => {
            let finalTranscript = '';
            let interimTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcript = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                finalTranscript += transcript;
              } else {
                interimTranscript += transcript;
              }
            }
            
            setInterimTranscript(interimTranscript);
            
            if (finalTranscript) {
              setTranscript(prev => prev + finalTranscript);
              handleTranslation(finalTranscript);
            }
          };

          recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
            
            if (event.error === 'not-allowed') {
              alert('Microphone access denied. Please allow microphone access and try again.');
            } else if (event.error === 'network') {
              alert('Network error. Speech recognition requires an internet connection.');
            } else if (event.error === 'service-not-allowed') {
              if (browserType === 'firefox') {
                alert('Speech recognition is disabled in Firefox. Please enable it in about:config by setting media.webspeech.recognition.enable to true');
              } else {
                alert('Speech recognition service not allowed. Please check your browser settings.');
              }
            }
          };

          recognition.onend = () => {
            console.log('Speech recognition ended');
            setIsListening(false);
            setInterimTranscript('');
          };

          recognitionRef.current = recognition;
          setIsSupported(true);
        } catch (error) {
          console.error('Error creating speech recognition:', error);
          setIsSupported(false);
        }
      } else {
        setIsSupported(false);
        console.log('Speech recognition not supported in this browser');
      }
    }
  }, [browserType]);

  const handleTranslation = async (text: string) => {
    setIsTranslating(true);
    // Simulate translation API call
    setTimeout(() => {
      const mockTranslations: { [key: string]: string } = {
        hindi: `नमस्ते, यह एक नमूना अनुवाद है: "${text}"`,
        tamil: `வணக்கம், இது ஒரு மாதிரி மொழிபெயர்ப்பு: "${text}"`,
        telugu: `నమస్కారం, ఇది ఒక నమూనా అనువాదం: "${text}"`,
        malayalam: `നമസ്കാരം, ഇത് ഒരു സാമ്പിൾ വിവർത്തനമാണ്: "${text}"`,
        bengali: `নমস্কার, এটি একটি নমুনা অনুবাদ: "${text}"`,
        kannada: `ನಮಸ್ಕಾರ, ಇದು ಒಂದು ಮಾದರಿ ಅನುವಾದ: "${text}"`,
        marathi: `नमस्कार, हे एक नमुना भाषांतर आहे: "${text}"`,
        gujarati: `નમસ્તે, આ એક નમૂનો અનુવાદ છે: "${text}"`,
      };
      setTranslation(mockTranslations[selectedLanguage] || `Translation to ${selectedLanguage}: ${text}`);
      setIsTranslating(false);
    }, 1500);
  };

  const startListening = async () => {
    addDebugInfo('Start listening button clicked');
    
    if (!recognitionRef.current) {
      addDebugInfo('ERROR: No recognition object available');
      alert('Speech recognition is not available. Please refresh the page and try again.');
      return;
    }
    
    if (isListening) {
      addDebugInfo('Already listening, ignoring click');
      return;
    }

    try {
      addDebugInfo('Requesting microphone permission...');
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      addDebugInfo('Microphone permission granted');
      
      setTranscript('');
      setTranslation('');
      setInterimTranscript('');
      
      // Play start beep
      try {
        playStartBeep();
        addDebugInfo('Start beep played');
      } catch (beepError) {
        addDebugInfo(`Beep error (non-critical): ${beepError}`);
      }
      
      // Small delay to let the beep play
      setTimeout(() => {
        try {
          addDebugInfo('Starting speech recognition...');
          recognitionRef.current.start();
        } catch (startError) {
          addDebugInfo(`Error starting recognition: ${startError}`);
          alert(`Failed to start speech recognition: ${startError}`);
        }
      }, 200);
      
    } catch (error) {
      addDebugInfo(`Microphone access error: ${error}`);
      alert('Microphone access is required for speech recognition. Please allow microphone access and try again.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      playStopBeep();
      recognitionRef.current.stop();
    }
  };

  const clearAll = () => {
    setTranscript('');
    setTranslation('');
    setInterimTranscript('');
    setIsTranslating(false);
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-gray-900 hover:text-gray-700 transition-colors">
            Translator
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">Home</Link>
            <Link href="/translator" className="text-gray-900 font-medium">Translator</Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Real-time Speech Translator
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Speak naturally and get instant translations in your preferred Indian language
            </p>
          </div>

          {/* Language Selector */}
          <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Choose Target Language</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                    selectedLanguage === lang.code
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-2xl mb-2">{lang.flag}</div>
                  <div className="font-medium">{lang.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Voice Input Section */}
          <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
            <div className="text-center mb-8">
              <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${
                isListening 
                  ? 'bg-gradient-to-br from-red-500 to-red-600 animate-pulse' 
                  : 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
              }`}>
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!isListening ? (
                  <button
                    onClick={startListening}
                    className="bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-all duration-200 transform hover:scale-105"
                  >
                    Start Speaking
                  </button>
                ) : (
                  <button
                    onClick={stopListening}
                    className="bg-red-600 text-white px-8 py-4 rounded-full font-medium hover:bg-red-700 transition-all duration-200 transform hover:scale-105"
                  >
                    Stop Recording
                  </button>
                )}
                
                <button
                  onClick={clearAll}
                  className="text-gray-700 px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition-all duration-200"
                >
                  Clear All
                </button>
              </div>
            </div>

            {isListening && (
              <div className="text-center mb-4">
                <div className="text-red-600 font-medium mb-2 flex items-center justify-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                  🎙️ Listening... Speak now
                </div>
                {interimTranscript && (
                  <div className="text-gray-500 italic text-sm">
                    "{interimTranscript}"
                  </div>
                )}
              </div>
            )}

            {!isSupported && (
              <div className="text-center mb-4 bg-yellow-50 border border-yellow-200 p-6 rounded-2xl">
                <div className="text-yellow-800 font-medium mb-3">
                  ⚠️ Speech Recognition Setup Required
                </div>
                {browserType === 'firefox' ? (
                  <div className="text-yellow-700 text-sm space-y-2">
                    <p><strong>Firefox users:</strong> Speech recognition is disabled by default. To enable it:</p>
                    <ol className="list-decimal list-inside space-y-1 text-left max-w-md mx-auto">
                      <li>Type <code className="bg-gray-200 px-1 rounded">about:config</code> in the address bar</li>
                      <li>Click "Accept the Risk and Continue"</li>
                      <li>Search for <code className="bg-gray-200 px-1 rounded">media.webspeech.recognition.enable</code></li>
                      <li>Set it to <code className="bg-gray-200 px-1 rounded">true</code></li>
                      <li>Refresh this page</li>
                    </ol>
                  </div>
                ) : (
                  <div className="text-yellow-700 text-sm">
                    <p>Speech recognition works best in Chrome, Edge, or Firefox (with setup).</p>
                    <p>Current browser: <strong>{browserType || 'Unknown'}</strong></p>
                  </div>
                )}
              </div>
            )}

            {/* Debug Panel */}
            {debugInfo.length > 0 && (
              <div className="text-center mb-4 bg-gray-50 border border-gray-200 p-4 rounded-2xl">
                <div className="text-gray-800 font-medium mb-2">🔧 Debug Info</div>
                <div className="text-xs text-gray-600 space-y-1 max-h-32 overflow-y-auto">
                  {debugInfo.map((info, index) => (
                    <div key={index} className="font-mono text-left">{info}</div>
                  ))}
                </div>
                <button 
                  onClick={() => setDebugInfo([])}
                  className="mt-2 text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear Debug
                </button>
              </div>
            )}
          </div>

          {/* Results Section */}
          {(transcript || translation) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Original Text */}
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                  Original (English)
                </h3>
                <div className="bg-gray-50 rounded-2xl p-6 min-h-[120px]">
                  <p className="text-gray-800 leading-relaxed">
                    {transcript && (
                      <span>{transcript}</span>
                    )}
                    {interimTranscript && (
                      <span className="text-gray-500 italic"> {interimTranscript}</span>
                    )}
                    {!transcript && !interimTranscript && (
                      <span className="text-gray-400">Your speech will appear here...</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Translation */}
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                  Translation ({languages.find(l => l.code === selectedLanguage)?.name})
                </h3>
                <div className="bg-gray-50 rounded-2xl p-6 min-h-[120px] relative">
                  {isTranslating ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                      <span className="ml-3 text-gray-600">Translating...</span>
                    </div>
                  ) : (
                    <p className="text-gray-800 leading-relaxed">
                      {translation || 'Translation will appear here...'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Browser Support Notice */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500">
              * Speech recognition works in Chrome, Edge, and Firefox (requires setup)
            </p>
            {browserType === 'firefox' && isSupported && (
              <p className="text-xs text-green-600 mt-1">
                ✅ Firefox speech recognition is enabled
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}