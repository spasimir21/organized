import { App as CapacitorApp } from '@capacitor/app';
import { StatusBar } from '@capacitor/status-bar';
import { App } from './app';

function fixStatusBar() {
  StatusBar.setBackgroundColor({ color: '#4f3824' }).catch(console.log);
}

async function main() {
  fixStatusBar();

  const app = new App();
  await app.init();

  app.header.setAddButtonVisible(true);

  CapacitorApp.addListener('backButton', () => {
    const didGoBack = app.goBack();
    if (!didGoBack) CapacitorApp.minimizeApp();
  });

  document.body.appendChild(app.ui.element);
}

window.addEventListener('DOMContentLoaded', main);
