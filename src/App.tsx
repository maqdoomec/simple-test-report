import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import axios from 'axios';
import Header from './components/Header';
import StatCards from './components/StatCards';
import ValidationStream, { type ValidationItem } from './components/ValidationStream';
import ProcessTree, { type RunNode, type TestCaseNode, type ProcessNode, type SubProcessNode, type SelectedNode } from './components/ProcessTree';
import RunList from './components/RunList';
import ToastContainer, { type ToastMessage, type ToastType } from './components/ToastContainer';
import { mockRuns, mockTestCases, mockProcesses, mockSubProcesses, mockValidations } from './mockData';

const API_BASE = 'http://localhost:3000/api';

function App() {
  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  // Config States
  const [useMockData, setUseMockData] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [apiStatus, setApiStatus] = useState<'online' | 'offline'>('online');
  const [isValidationCollapsed, setIsValidationCollapsed] = useState(false);
  const [isRunsCollapsed, setIsRunsCollapsed] = useState(false);

  // Data States
  const [runs, setRuns] = useState<{ data: RunNode }[]>([]);
  const [testCases, setTestCases] = useState<{ data: TestCaseNode }[]>([]);
  const [processes, setProcesses] = useState<{ data: ProcessNode }[]>([]);
  const [subProcesses, setSubProcesses] = useState<{ data: SubProcessNode }[]>([]);
  const [validations, setValidations] = useState<{ data: ValidationItem }[]>([]);

  // Layout States
  const [leftWidth, setLeftWidth] = useState(250);
  const [rightWidth, setRightWidth] = useState(480);
  const leftWidthRef = useRef(250);
  const rightWidthRef = useRef(480);

  useEffect(() => {
    const savedLeft = localStorage.getItem("runsWidth");
    if (savedLeft) {
      setLeftWidth(parseInt(savedLeft, 10));
      leftWidthRef.current = parseInt(savedLeft, 10);
    }
    const savedRight = localStorage.getItem("validationWidth");
    if (savedRight) {
      setRightWidth(parseInt(savedRight, 10));
      rightWidthRef.current = parseInt(savedRight, 10);
    }
  }, []);

  // Selection States
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<SelectedNode>(null);
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});

  // Toast State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const fetchExecutionData = useCallback(async (bypassPause = false) => {
    if (useMockData) {
      setRuns(mockRuns);
      setTestCases(mockTestCases);
      setProcesses(mockProcesses);
      setSubProcesses(mockSubProcesses);
      setValidations(mockValidations);
      setApiStatus('online');
      return;
    }

    if (isPaused && !bypassPause) return;

    try {
      const response = await axios.get(`${API_BASE}/execution-data`);
      setRuns(response.data.runs || []);
      setTestCases(response.data.testCases || []);
      setProcesses(response.data.processes || []);
      setSubProcesses(response.data.subProcesses || []);
      setValidations(response.data.validations || []);
      setApiStatus('online');
    } catch (e: any) {
      setRuns([]);
      setTestCases([]);
      setProcesses([]);
      setSubProcesses([]);
      setValidations([]);
      setApiStatus('offline');
      showToast(`API Connection Failed: ${e.message}`, 'error');
    }
  }, [useMockData, isPaused, showToast]);

  // Polling Effect
  useEffect(() => {
    fetchExecutionData(true); // Initial fetch
    const interval = setInterval(() => fetchExecutionData(), 3000);
    return () => clearInterval(interval);
  }, [fetchExecutionData]);

  // Handlers
  const handleToggleMock = () => {
    const newMockState = !useMockData;
    setUseMockData(newMockState);
    showToast(newMockState ? 'Mock Data Enabled' : 'Mock Data Disabled', 'info');
    if (newMockState) {
      setIsPaused(true);
      fetchExecutionData(true);
    } else {
      setIsPaused(false);
      fetchExecutionData(true);
    }
  };

  const handleResetTypes = async () => {
    if (useMockData) return;
    try {
      showToast('Resetting execution types...', 'info');
      await axios.post(`${API_BASE}/types/reset`);
      setRuns([]);
      setTestCases([]);
      setProcesses([]);
      setSubProcesses([]);
      setValidations([]);
      setSelectedRunId(null);
      setSelectedNode(null);
      showToast('Types reset successfully', 'success');
      fetchExecutionData(true);
    } catch (e: any) {
      showToast('Failed to reset types', 'error');
    }
  };

  const handleExportCSV = () => {
    showToast('Exporting to CSV...', 'info');
    const csvContent = "data:text/csv;charset=utf-8,Run ID,Status\n"
      + runs.map(r => `${r.data.run_id},${r.data.status}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "execution_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleToggleNodeCollapse = (id: string) => {
    setCollapsedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Drag Resizers
  const startResizeLeft = (e: React.MouseEvent) => {
    if (isRunsCollapsed) return;
    e.preventDefault();
    const startX = e.clientX;
    const startW = leftWidthRef.current;

    const onMove = (ev: MouseEvent) => {
      let newWidth = startW + (ev.clientX - startX);
      const rightW = rightWidthRef.current;
      const available = document.body.clientWidth - 40 - 28 - (isValidationCollapsed ? 48 : rightW) - 200;
      newWidth = Math.max(160, Math.min(Math.max(160, available), newWidth));
      setLeftWidth(newWidth);
      leftWidthRef.current = newWidth;
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      localStorage.setItem("runsWidth", leftWidthRef.current.toString());
      document.body.style.cursor = '';
    };

    document.body.style.cursor = 'col-resize';
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  const startResizeRight = (e: React.MouseEvent) => {
    if (isValidationCollapsed) return;
    e.preventDefault();
    const startX = e.clientX;
    const startW = rightWidthRef.current;

    const onMove = (ev: MouseEvent) => {
      let newWidth = startW - (ev.clientX - startX);
      const leftW = leftWidthRef.current;
      const available = document.body.clientWidth - 40 - 28 - leftW - 200;
      newWidth = Math.max(200, Math.min(Math.max(200, available), newWidth));
      setRightWidth(newWidth);
      rightWidthRef.current = newWidth;
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      localStorage.setItem("validationWidth", rightWidthRef.current.toString());
      document.body.style.cursor = '';
    };

    document.body.style.cursor = 'col-resize';
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  // Derived Values & Filtering for View
  const getEffectiveStatus = (baseStatus: string, childStatuses: string[]) => {
    if (['PASS', 'FAIL', 'RUNNING'].includes(baseStatus)) return baseStatus;
    if (childStatuses.includes('RUNNING')) return 'RUNNING';
    if (childStatuses.includes('FAIL')) return 'FAIL';
    const hasPass = childStatuses.includes('PASS');
    const hasPending = childStatuses.includes('PENDING');
    if (hasPass && !hasPending) return 'PASS';
    if (hasPass && hasPending) return 'RUNNING';
    return 'PENDING';
  };

  const stats = useMemo(() => {
    let total = 0, pass = 0, fail = 0, running = 0, pending = 0;
    runs.forEach(r => {
      const tcStatuses = testCases.filter(t => t.data.run_id === r.data.run_id).map(t => t.data.status);
      const eff = getEffectiveStatus(r.data.status, tcStatuses);
      total++;
      if (eff === 'PASS') pass++;
      else if (eff === 'FAIL') fail++;
      else if (eff === 'RUNNING') running++;
      else if (eff === 'PENDING') pending++;
    });
    const rateNum = total === 0 ? 0 : Math.round((pass / total) * 100);
    const rate = `${rateNum}%`;
    return { total, pass, fail, running, pending, rate, rateNum };
  }, [runs, testCases]);

  const calcRunProgress = useCallback((runId: string) => {
    const tcs = testCases.filter(t => t.data.run_id === runId);
    if (tcs.length === 0) return 0;
    const finished = tcs.filter(t => t.data.status === 'PASS' || t.data.status === 'FAIL').length;
    return Math.round((finished / tcs.length) * 100);
  }, [testCases]);

  // Set default run selection
  useEffect(() => {
    if (!selectedRunId && runs.length > 0) {
      const active = runs.find(r => r.data.status === 'RUNNING');
      const failed = runs.find(r => r.data.status === 'FAIL');
      setSelectedRunId(active ? active.data.run_id : (failed ? failed.data.run_id : runs[0].data.run_id));
    }
  }, [runs, selectedRunId]);

  const filteredTestCases = testCases.filter(t => t.data.run_id === selectedRunId).map(t => t.data);
  const filteredProcesses = processes.filter(p => p.data.run_id === selectedRunId).map(p => p.data);
  const filteredSubProcesses = subProcesses.filter(s => s.data.run_id === selectedRunId).map(s => s.data);

  const selectedRunData = runs.find(r => r.data.run_id === selectedRunId)?.data || null;

  const getFilteredValidations = () => {
    if (selectedNode) {
      const n = selectedNode;
      return validations.filter(v => {
        const d = v.data;
        if (d.run_id !== n.runId) return false;
        if (n.type === 'tc') return d.testcase_id === n.tcId;
        if (n.type === 'proc') return d.testcase_id === n.tcId && d.process_id === n.procId;
        if (n.type === 'sp') return d.testcase_id === n.tcId && d.process_id === n.procId && d.subprocess_id === n.spId;
        return false;
      }).map(v => v.data);
    }
    return selectedRunId ? validations.filter(v => v.data.run_id === selectedRunId).map(v => v.data) : [];
  };

  const displayValidations = getFilteredValidations().slice(0, 500).map(v => {
    const tcName = testCases.find(t => t.data.testcase_id === v.testcase_id)?.data.testcase_name;
    const procName = processes.find(p => p.data.process_id === v.process_id)?.data.process_name;
    const spName = subProcesses.find(s => s.data.subprocess_id === v.subprocess_id)?.data.subprocess_name;

    return {
      ...v,
      testcase_name: tcName,
      process_name: procName,
      subprocess_name: spName
    };
  });

  // Build breadcrumb from selectedNode
  const breadcrumb = useMemo(() => {
    if (!selectedNode) return [];
    const crumbs: string[] = [];
    // if (selectedRunData) crumbs.push(selectedRunData.run_name || selectedRunData.run_id);
    if (selectedRunData) crumbs.push(selectedRunData.run_id);
    if (selectedNode.tcId) {
      
      // crumbs.push(tc?.testcase_name || selectedNode.tcId);
      crumbs.push(selectedNode.tcId);
    }
    if (selectedNode.procId) {
      const proc = filteredProcesses.find(p => p.process_id === selectedNode.procId);
      crumbs.push(proc?.process_name || selectedNode.procId);
    }
    if (selectedNode.spId) {
      const sp = filteredSubProcesses.find(s => s.subprocess_id === selectedNode.spId);
      crumbs.push(sp?.subprocess_name || selectedNode.spId);
    }
    return crumbs;
  }, [selectedNode, selectedRunData, filteredTestCases, filteredProcesses, filteredSubProcesses]);

  // Compute left column width for grid
  const effectiveLeftWidth = isRunsCollapsed ? 48 : leftWidth;

  return (
    <div className="min-h-screen text-text-main flex flex-col p-2.5 gap-2.5 h-screen overflow-hidden">
      <Header
        useMockData={useMockData}
        toggleMockData={handleToggleMock}
        resetTypes={handleResetTypes}
        isPaused={isPaused}
        togglePause={() => setIsPaused(!isPaused)}
        exportCSV={handleExportCSV}
        apiStatus={apiStatus}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {useMockData && (
        <div className="bg-status-fail/10 border border-status-fail/40 rounded-lg p-3 text-status-fail text-[13px] flex items-center justify-center gap-2.5 font-medium shadow-[0_4px_12px_rgba(244,63,94,0.05)]">
          <span className="text-[16px] leading-none">⚠</span> Displaying Mock Data
        </div>
      )}

      <StatCards
        totalRuns={stats.total}
        totalPassed={stats.pass}
        totalFailed={stats.fail}
        totalRunning={stats.running}
        totalPending={stats.pending}
        passRate={stats.rate}
        passRateNum={stats.rateNum}
      />

      {/* Main Layout Grid */}
      <div
        className="grid gap-0 items-start h-[calc(100vh-160px)]"
        style={{ gridTemplateColumns: `${effectiveLeftWidth}px 14px minmax(200px, 1fr) 14px ${isValidationCollapsed ? 48 : rightWidth}px`, transition: 'grid-template-columns 0.28s ease' }}
      >
        <RunList
          runs={runs.map(r => r.data)}
          testCases={testCases.map(t => t.data)}
          selectedRunId={selectedRunId}
          setSelectedRunId={setSelectedRunId}
          calcRunProgress={calcRunProgress}
          isCollapsed={isRunsCollapsed}
          toggleCollapse={() => setIsRunsCollapsed(!isRunsCollapsed)}
        />

        {/* Left Resizer */}
        <div
          className={`w-[14px] h-full relative bg-transparent flex items-center justify-center select-none before:content-[''] before:absolute before:inset-y-0 before:w-[2px] before:bg-border-medium transition-colors ${isRunsCollapsed ? 'cursor-default' : 'cursor-col-resize hover:before:bg-accent-primary'}`}
          onMouseDown={startResizeLeft}
        />

        <ProcessTree
          run={selectedRunData}
          testCases={filteredTestCases}
          processes={filteredProcesses}
          subProcesses={filteredSubProcesses}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
          collapsedNodes={collapsedNodes}
          toggleNodeCollapse={handleToggleNodeCollapse}
        />

        {/* Right Resizer */}
        <div
          className={`w-[14px] h-full relative bg-transparent flex items-center justify-center select-none before:content-[''] before:absolute before:inset-y-0 before:w-[2px] before:bg-border-medium transition-colors ${isValidationCollapsed ? 'cursor-default' : 'cursor-col-resize hover:before:bg-accent-primary'}`}
          onMouseDown={startResizeRight}
        />

        <ValidationStream
          validations={displayValidations}
          isCollapsed={isValidationCollapsed}
          toggleCollapse={() => setIsValidationCollapsed(!isValidationCollapsed)}
          emptyMessage={selectedNode ? "No validations for this selection." : "Select a node in the Process Tree to filter validations."}
          breadcrumb={breadcrumb}
        />
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default App;
