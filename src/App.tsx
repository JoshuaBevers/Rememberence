import React, { useEffect } from 'react';
import { Terminal } from 'malwoden';

import * as Game from './game';

function App() {
  const requestRef = React.useRef<number>(NaN);

  useEffect(() => {
    const mount = document.getElementById('Rememberance')!;
    const terminal = new Terminal.RetroTerminal({
      width: 70,
      height: 50,
      imageURL: './font_16.png',
      charWidth: 16,
      charHeight: 16,
      mountNode: mount,
    });

    Game.init(terminal);

    const loop = () => {
      Game.loop();
      requestRef.current = window.requestAnimationFrame(loop);
    };
    requestRef.current = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(requestRef.current);
  }, []);
  return (
    <div
      id='Rememberance'
      style={{ display: 'flex', justifyContent: 'center', paddingTop: '50px' }}
    >
      boo
    </div>
  );
}

export default App;
