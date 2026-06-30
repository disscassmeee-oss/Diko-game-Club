import React, { useEffect, useState, useRef } from 'react';
import './App.css';

function App() {
  const [sessionActive, setSessionActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [balance, setBalance] = useState(0);
  const [locked, setLocked] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [computerOn, setComputerOn] = useState(true);
  const timerInterval = useRef(null);
  const sessionTimer = useRef(null);

  useEffect(() => {
    const setupElectronListeners = async () => {
      if (window.electron) {
        const computerId = await window.electron.getComputerId();
        console.log('Computer ID:', computerId);

        window.electron.onSocketConnected(() => {
          console.log('Connected to server');
        });

        window.electron.onSocketDisconnected(() => {
          console.log('Disconnected from server');
        });

        window.electron.onLockScreen((data) => {
          setSessionActive(true);
          setCustomerName(data.customerName || 'Customer');
          setBalance(data.balance || 0);
          const durationMinutes = data.durationMinutes || 60;
          setTimeRemaining(durationMinutes * 60);
          setLocked(true);
          disableTaskManager();
        });

        window.electron.onUnlockScreen(() => {
          setSessionActive(false);
          setLocked(false);
          setTimeRemaining(0);
          enableTaskManager();
          window.electron.offLockScreen();
          window.electron.offUnlockScreen();
        });

        window.electron.onBroadcastMessage((data) => {
          setBroadcastMessage(data.message);
          setTimeout(() => setBroadcastMessage(''), 5000);
        });
      }
    };

    setupElectronListeners();

    return () => {
      if (window.electron) {
        window.electron.offLockScreen();
        window.electron.offUnlockScreen();
        window.electron.offBroadcastMessage();
      }
    };
  }, []);

  useEffect(() => {
    if (sessionActive && timeRemaining > 0) {
      timerInterval.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            sessionEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [sessionActive, timeRemaining]);

  const sessionEnd = () => {
    setSessionActive(false);
    setLocked(true);
    lockKeyboardAndMouse();
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const lockKeyboardAndMouse = () => {
    if (process.platform === 'win32') {
      // Lock input through keyboard hook
      document.addEventListener('keydown', preventDefault);
      document.addEventListener('mousedown', preventDefault);
      document.addEventListener('contextmenu', preventDefault);
    }
  };

  const preventDefault = (e) => {
    if (locked) {
      e.preventDefault();
    }
  };

  const disableTaskManager = () => {
    // Disable task manager via registry (Windows)
    if (process.platform === 'win32') {
      const { spawn } = require('child_process');
      spawn('reg', [
        'add',
        'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\System',
        '/v',
        'DisableTaskMgr',
        '/t',
        'REG_DWORD',
        '/d',
        '1',
        '/f',
      ]);
    }
  };

  const enableTaskManager = () => {
    if (process.platform === 'win32') {
      const { spawn } = require('child_process');
      spawn('reg', [
        'add',
        'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\System',
        '/v',
        'DisableTaskMgr',
        '/t',
        'REG_DWORD',
        '/d',
        '0',
        '/f',
      ]);
    }
  };

  const launchGame = async (game) => {
    if (window.electron) {
      await window.electron.launchGame(game);
    }
  };

  if (!sessionActive) {
    return (
      <div className="app idle-screen">
        <div className="idle-content">
          <h1>Diko Game Club</h1>
          <p>Ready for next customer</p>
        </div>
        {broadcastMessage && (
          <div className="broadcast-banner">
            <p>{broadcastMessage}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="app lock-screen">
      <div className="lock-content">
        <div className="timer-section">
          <div className="timer-display">{formatTime(timeRemaining)}</div>
        </div>

        <div className="customer-info">
          <p className="customer-name">Customer: {customerName}</p>
          <p className="balance">Balance: ৳{balance.toFixed(2)}</p>
        </div>

        <div className="games-section">
          <h2>Quick Launch Games</h2>
          <div className="game-buttons">
            <button onClick={() => launchGame('steam')} className="game-btn">
              Steam
            </button>
            <button onClick={() => launchGame('cs2')} className="game-btn">
              CS2
            </button>
            <button onClick={() => launchGame('dota2')} className="game-btn">
              Dota 2
            </button>
            <button onClick={() => launchGame('valorant')} className="game-btn">
              Valorant
            </button>
          </div>
        </div>

        {broadcastMessage && (
          <div className="broadcast-notification">
            <p>{broadcastMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
