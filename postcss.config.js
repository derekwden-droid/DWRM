@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  *, *::before, *::after { box-sizing: border-box; }

  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: #030712;
    color: #e2e8f0;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #111827; }
  ::-webkit-scrollbar-thumb { background: #374151; border-radius: 2px; }
}

@layer components {
  .card {
    background-color: #111827;
    border: 1px solid #1f2937;
    border-radius: 2px;
  }

  .card-header {
    border-bottom: 1px solid #1f2937;
    padding: 8px 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    color: #6b7280;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .field-label {
    display: block;
    font-size: 10px;
    color: #6b7280;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  .text-input {
    width: 100%;
    background-color: #0d1117;
    border: 1px solid #1f2937;
    color: #e2e8f0;
    padding: 8px 12px;
    font-size: 12px;
    font-family: 'JetBrains Mono', monospace;
    outline: none;
    transition: border-color 0.15s;
  }
  .text-input:focus { border-color: rgba(167, 139, 250, 0.5); }
  .text-input::placeholder { color: rgba(107, 114, 128, 0.5); }

  .btn-primary {
    background-color: rgba(167, 139, 250, 0.1);
    border: 1px solid rgba(167, 139, 250, 0.4);
    color: #a78bfa;
    padding: 8px 16px;
    font-size: 11px;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.15s;
  }
  .btn-primary:hover:not(:disabled) {
    background-color: rgba(167, 139, 250, 0.2);
    border-color: rgba(167, 139, 250, 0.7);
  }
  .btn-primary:disabled { opacity: 0.3; cursor: not-allowed; }

  .btn-ghost {
    background: transparent;
    border: 1px solid #1f2937;
    color: #6b7280;
    padding: 6px 12px;
    font-size: 11px;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.15s;
  }
  .btn-ghost:hover:not(:disabled) { border-color: #374151; color: #e2e8f0; }
  .btn-ghost:disabled { opacity: 0.3; cursor: not-allowed; }

  .badge-cpu     { border: 1px solid rgba(245,158,11,0.3); background: rgba(245,158,11,0.05); color: #f59e0b; padding: 2px 8px; font-size: 10px; }
  .badge-gpu     { border: 1px solid rgba(96,165,250,0.3); background: rgba(96,165,250,0.05); color: #60a5fa; padding: 2px 8px; font-size: 10px; }
  .badge-quantum { border: 1px solid rgba(167,139,250,0.3); background: rgba(167,139,250,0.05); color: #a78bfa; padding: 2px 8px; font-size: 10px; }

  .score-bar-track {
    height: 4px;
    background-color: rgba(55, 65, 81, 0.5);
    border-radius: 2px;
    overflow: hidden;
  }

  .score-bar-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.3s ease forwards;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid rgba(167, 139, 250, 0.3);
  border-top-color: #a78bfa;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
