import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('----------------------------------------------------');
console.log('🚀 Launching Love Studio Full Stack (Frontend + Servers)');
console.log('----------------------------------------------------');

// 1. Start Python TTS Server (port 8000)
console.log('▶ Starting Python TTS Server (http://localhost:8000)...');
const pythonProcess = spawn('python', ['server/tts_server.py'], { cwd: rootDir, stdio: 'inherit', shell: true });

// 2. Start Express API Server (port 3001)
console.log('▶ Starting Express API Server (http://localhost:3001)...');
const nodeProcess = spawn('node', ['server/index.js'], { cwd: rootDir, stdio: 'inherit', shell: true });

// 3. Start Vite Frontend (port 5173)
console.log('▶ Starting Vite Frontend...');
const viteProcess = spawn('npx', ['vite'], { cwd: rootDir, stdio: 'inherit', shell: true });

process.on('SIGINT', () => {
  console.log('\nShutting down all processes...');
  pythonProcess.kill();
  nodeProcess.kill();
  viteProcess.kill();
  process.exit();
});
