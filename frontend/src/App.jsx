import { useState } from 'react';

function App() {
  const [task, setTask] = useState('');
  const [result, setResult] = useState(null);

  const routeTask = async () => {
    const response = await fetch('/api/route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task_description: task })
    });
    const data = await response.json();
    setResult(data);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        <h1 className="text-3xl font-bold text-blue-400">DWRM Orchestrator</h1>
        <p className="text-slate-400">Zero-Trust Workload Routing Middleware</p>
        
        <div className="space-y-4">
          <textarea 
            className="w-full p-4 bg-slate-800 rounded border border-slate-700 focus:border-blue-500 outline-none"
            rows="4"
            placeholder="Describe the workload (e.g., 'Optimize quantum annealing sequence' or 'Parse basic text')..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <button 
            onClick={routeTask}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition-colors"
          >
            Route Workload
          </button>
        </div>

        {result && (
          <div className="p-6 bg-slate-800 rounded border border-green-500/30">
            <h3 className="text-xl font-semibold text-green-400 mb-2">Routing Complete</h3>
            <pre className="text-sm text-slate-300 overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
