import { useState, useEffect, useMemo, type FC } from 'react';
import type { RunNode, TestCaseNode, ProcessNode } from './ProcessTree';
import { getEffectiveStatus } from '../utils';

interface RunListProps {
    runs: RunNode[];
    testCases: TestCaseNode[];
    processes: ProcessNode[];
    selectedRunId: string | null;
    setSelectedRunId: (id: string) => void;
    calcRunProgress: (runId: string) => number;
    isCollapsed: boolean;
    toggleCollapse: () => void;
}

const RunList: FC<RunListProps> = ({ runs, testCases, processes, selectedRunId, setSelectedRunId, calcRunProgress, isCollapsed, toggleCollapse }) => {
    const [searchValue, setSearchValue] = useState("");
    const [activeFilter, setActiveFilter] = useState("ALL");

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (runs.length === 0) return;
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                const currentIndex = runs.findIndex(r => r.run_id === selectedRunId);
                let nextIndex = currentIndex;

                if (e.key === 'ArrowDown') {
                    nextIndex = currentIndex < runs.length - 1 ? currentIndex + 1 : currentIndex;
                } else if (e.key === 'ArrowUp') {
                    nextIndex = currentIndex > 0 ? currentIndex - 1 : 0;
                }

                if (nextIndex !== currentIndex && nextIndex >= 0) {
                    setSelectedRunId(runs[nextIndex].run_id);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [runs, selectedRunId, setSelectedRunId]);

    const runStats = useMemo(() => {
        const stats: Record<string, { pass: number; fail: number; running: number; total: number }> = {};
        runs.forEach(r => {
            stats[r.run_id] = { pass: 0, fail: 0, running: 0, total: 0 };
        });
        testCases.forEach(tc => {
            if (stats[tc.run_id]) {
                const procStatuses = processes.filter(p => p.testcase_id === tc.testcase_id).map(p => p.status);
                const effStatus = getEffectiveStatus(tc.status, procStatuses);

                stats[tc.run_id].total++;
                if (effStatus === 'PASS') stats[tc.run_id].pass++;
                else if (effStatus === 'FAIL') stats[tc.run_id].fail++;
                else if (effStatus === 'RUNNING') stats[tc.run_id].running++;
            }
        });
        return stats;
    }, [runs, testCases, processes]);

    const filteredRuns = useMemo(() => {
        return runs.filter(r => {
            if (activeFilter !== 'ALL' && r.status !== activeFilter) return false;
            if (searchValue && !r.run_id.toLowerCase().includes(searchValue.toLowerCase()) &&
                !(r.run_name || '').toLowerCase().includes(searchValue.toLowerCase())) {
                return false;
            }
            return true;
        });
    }, [runs, activeFilter, searchValue]);

    const handleFilterClick = (filter: string) => {
        setActiveFilter(filter);
    };

    const getStatusDotClass = (status: string) => {
        if (status === 'PASS') return 'bg-status-pass shadow-[0_0_4px_var(--color-status-pass)]';
        if (status === 'FAIL') return 'bg-status-fail shadow-[0_0_4px_var(--color-status-fail)]';
        if (status === 'RUNNING') return 'bg-status-running shadow-[0_0_8px_var(--color-status-running)] animate-pulse-running';
        return 'bg-status-pending';
    };

    return (
        <div
            className={`flex flex-col min-h-0 bg-bg-card rounded-[8px] border border-border-medium h-full shadow-[0_4px_16px_rgba(0,0,0,0.15)] transition-all duration-300 ${isCollapsed ? 'cursor-pointer hover:border-text-muted hover:bg-white/5' : ''}`}
            onClick={isCollapsed ? toggleCollapse : undefined}
        >

            {/* Header */}
            <div className={`bg-bg-panel border-b border-border-medium p-[15px] font-semibold flex shadow-[0_2px_8px_rgba(0,0,0,0.2)] shrink-0 gap-[10px] ${isCollapsed ? 'justify-center border-none p-4 flex-col items-center' : 'flex-col'}`}>
                <div className="flex justify-between items-center">
                    <button
                        onClick={(e) => { e.stopPropagation(); toggleCollapse(); }}
                        className={`bg-bg-panel border border-border-medium rounded-md w-7 h-7 flex items-center justify-center text-text-muted cursor-pointer transition-all duration-200 hover:text-text-main hover:bg-white/10 z-20 shrink-0 ${isCollapsed ? 'transform rotate-180' : ''}`}
                        title={isCollapsed ? "Expand Runs" : "Collapse Runs"}
                    >
                        ◀
                    </button>
                    {!isCollapsed && (
                        <>
                            <div className="flex items-center text-[14px] flex-1 ml-2">
                                Available Runs
                            </div>
                            <span className="bg-white/10 text-[11px] px-2 py-0.5 rounded-[12px] text-text-muted">
                                {filteredRuns.length}
                            </span>
                        </>
                    )}
                </div>

                {/* Search (expanded only) */}
                {!isCollapsed && (
                    <>
                        <div className="flex items-center bg-bg-main border border-border-medium rounded px-[8px] focus-within:border-accent-primary focus-within:shadow-[0_0_0_1px_rgba(99,102,241,0.5)] transition-all h-[30px]">
                            <span className="text-text-muted opacity-50 mr-1.5 grayscale shrink-0 text-[14px]">🔍</span>
                            <input
                                type="text"
                                placeholder="Search…"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                className="flex-1 bg-transparent border-none text-[12px] py-0 text-text-main placeholder-text-muted focus:outline-none min-w-0"
                            />
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex flex-wrap gap-[6px]">
                            <button
                                onClick={() => handleFilterClick('ALL')}
                                className={`px-3 py-[3px] rounded bg-bg-main border text-[11px] font-bold tracking-wider cursor-pointer hover:-translate-y-px transition-all duration-150 flex items-center justify-center ${activeFilter === 'ALL' ? 'border-accent-primary text-accent-primary bg-accent-primary/10 shadow-[0_0_8px_rgba(99,102,241,0.3)]' : 'border-border-medium text-text-muted hover:border-text-main'}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => handleFilterClick('RUNNING')}
                                className={`px-3 py-[3px] rounded bg-bg-main border text-[11px] font-bold tracking-wider cursor-pointer hover:-translate-y-px transition-all duration-150 flex items-center justify-center ${activeFilter === 'RUNNING' ? 'border-status-running text-status-running bg-status-running/10 shadow-[0_0_8px_rgba(255,153,0,0.3)]' : 'border-border-medium text-text-muted hover:border-status-running/50'}`}
                            >
                                <span className="text-status-running mr-[4px]">▶</span> Runs
                            </button>
                            <button
                                onClick={() => handleFilterClick('FAIL')}
                                className={`px-3 py-[3px] rounded bg-bg-main border text-[11px] font-bold tracking-wider cursor-pointer hover:-translate-y-px transition-all duration-150 flex items-center justify-center ${activeFilter === 'FAIL' ? 'border-status-fail text-status-fail bg-status-fail/10 shadow-[0_0_8px_rgba(244,63,94,0.3)]' : 'border-border-medium text-text-muted hover:border-status-fail/50'}`}
                            >
                                ✕
                            </button>
                            <button
                                onClick={() => handleFilterClick('PASS')}
                                className={`px-3 py-[3px] rounded bg-bg-main border text-[11px] font-bold tracking-wider cursor-pointer hover:-translate-y-px transition-all duration-150 flex items-center justify-center ${activeFilter === 'PASS' ? 'border-status-pass text-status-pass bg-status-pass/10 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'border-border-medium text-text-muted hover:border-status-pass/50'}`}
                            >
                                ✓
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Collapsed: vertical text + status dots */}
            {isCollapsed && (
                <div className="flex-1 flex flex-col items-center py-4 relative w-full gap-[6px] overflow-y-auto">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] text-center rotate-90 text-[11px] font-bold tracking-[3px] text-text-muted uppercase pointer-events-none origin-center whitespace-nowrap">
                        Runs
                    </div>
                    {filteredRuns.map(run => (
                        <div
                            key={run.run_id}
                            className={`w-3 h-3 rounded-full shrink-0 cursor-pointer transition-all hover:scale-125 ${getStatusDotClass(run.status)} ${selectedRunId === run.run_id ? 'ring-2 ring-accent-primary ring-offset-1 ring-offset-bg-card' : ''}`}
                            title={run.run_id}
                            onClick={(e) => { e.stopPropagation(); setSelectedRunId(run.run_id); }}
                        />
                    ))}
                </div>
            )}

            {/* List (expanded only) */}
            {!isCollapsed && (
                <div className="flex-1 min-h-0 overflow-y-auto p-[10px] pb-6 bg-bg-card custom-scrollbar">
                    {filteredRuns.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-text-muted text-[13px] gap-3">
                            <svg className="w-10 h-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <span>No execution data</span>
                        </div>
                    ) : (
                        filteredRuns.map(run => {
                            const isSelected = selectedRunId === run.run_id;
                            const pct = calcRunProgress(run.run_id);
                            const stats = runStats[run.run_id] || { pass: 0, fail: 0, running: 0, total: 0 };

                            return (
                                <div
                                    key={run.run_id}
                                    onClick={() => setSelectedRunId(run.run_id)}
                                    className={`p-[14px] rounded-[6px] cursor-pointer mb-[8px] transition-all duration-200 border relative overflow-hidden group ${isSelected
                                        ? 'bg-accent-primary/10 border-accent-primary shadow-[0_4px_12px_rgba(0,0,0,0.2)]'
                                        : 'bg-bg-panel border-transparent hover:bg-white/4 hover:shadow-[0_4px_10px_rgba(0,0,0,0.2)]'
                                        }`}
                                >
                                    <div className="flex justify-between items-center mb-1.5 relative z-10 w-full">
                                        <span className="font-mono text-[13px] font-bold text-accent-primary truncate max-w-[calc(100%-60px)]">
                                            {run.run_id}
                                        </span>
                                        <span className={`px-[6px] py-[2px] rounded-[3px] text-[10px] font-bold shadow-sm shrink-0 whitespace-nowrap ml-1 ${run.status === 'PASS' ? 'bg-status-pass text-white' :
                                            run.status === 'FAIL' ? 'bg-status-fail text-white' :
                                                run.status === 'RUNNING' ? 'bg-status-running text-black animate-blink-running' : 'bg-status-pending text-white'
                                            }`}>
                                            {run.status}
                                        </span>
                                    </div>

                                    <div className={`text-[12px] truncate mb-2.5 relative z-10 w-full ${isSelected ? 'text-text-main' : 'text-text-muted'}`}>
                                        {run.run_name || 'Unnamed Run'}
                                    </div>

                                    {/* TC Counts */}
                                    <div className="flex items-center gap-[6px] text-[10px] font-mono text-text-muted relative z-10">
                                        {stats.pass > 0 && <span className="text-status-pass flex items-center gap-[2px]">✓ {stats.pass}</span>}
                                        {stats.fail > 0 && <span className="text-status-fail flex items-center gap-[2px]">✕ {stats.fail}</span>}
                                        {stats.running > 0 && <span className="text-status-running flex items-center gap-[2px]">↻ {stats.running}</span>}
                                        <span className="ml-auto opacity-60 bg-black/20 px-1 py-0.5 rounded">{stats.total}TC</span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="h-[4px] bg-border-medium rounded-[2px] overflow-hidden relative z-10 w-full mt-2">
                                        <div
                                            className={`h-full transition-all duration-300 shadow ${run.status === 'PASS' ? 'bg-status-pass shadow-status-pass/50' :
                                                run.status === 'FAIL' ? 'bg-status-fail shadow-status-fail/50' : run.status === 'RUNNING' ? 'bg-status-running animate-shimmer' : 'bg-status-pending'
                                                }`}
                                            style={{
                                                width: `${pct}%`,
                                                backgroundImage: run.status === 'RUNNING' ? 'linear-gradient(90deg, var(--color-status-running), #ff9900, var(--color-status-running))' : 'none',
                                                backgroundSize: run.status === 'RUNNING' ? '200% 100%' : 'auto'
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

export default RunList;
