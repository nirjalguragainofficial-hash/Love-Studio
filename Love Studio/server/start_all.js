import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('----------------------------------------------------');
console.log('🚀 Launching Love Studio Full Stack (Frontend + Servers)');
console.log('----------------------------------------------------');

/**
 * Spawns a child process and attaches error/close handlers for visibility.
 * @param {string} name   - Human-readable label for log output
 * @param {string} cmd    - Executable to run
 * @param {string[]} args - Arguments to pass to the executable
 * @returns {import('child_process').ChildProcess}
 */
function startProcess(name, cmd, args) {
  const proc = spawn(cmd, args, { cwd: rootDir, stdio: 'inherit', shell: true });

  proc.on('error', (err) => {
    console.error(`❌ [${name}] Failed to start: ${err.message}`);
  });

  proc.on('close', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`⚠️  [${name}] exited with code ${code}`);
    }
  });

  return proc;
}

// 1. Start Python TTS Server (port 8000)
console.log('▶ Starting Python TTS Server (http://localhost:8000)...');
const pythonProcess = startProcess('TTS Server', 'python', ['server/tts_server.py']);

// 2. Start Express API Server (port 3001)
console.log('▶ Starting Express API Server (http://localhost:3001)...');
const nodeProcess = startProcess('API Server', 'node', ['server/index.js']);

// 3. Start Vite Frontend (port 5173)
console.log('▶ Starting Vite Frontend (http://localhost:5173)...');
const viteProcess = startProcess('Vite', 'npx', ['vite']);

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down all processes...');
  pythonProcess.kill();
  nodeProcess.kill();
  viteProcess.kill();
  process.exit(0);
});
