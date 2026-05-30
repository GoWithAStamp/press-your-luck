/*
 * Press-Your-Luck! — score tracker
 * https://press-your-luck.me
 *
 * Created by Henrique Vasconcelos · cellocode.pt
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import PressYourLuckTracker from './Tracker.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PressYourLuckTracker
      storageKey="pyl:game"
      initialPalette="onyx"
      initialMode="dark"
    />
  </React.StrictMode>
);
