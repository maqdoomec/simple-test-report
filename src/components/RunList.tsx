import { useState, useEffect, useMemo, type FC } from 'react';
import type { RunNode, TestCaseNode } from './ProcessTree';

interface RunListProps {
    runs: RunNode[];
    testCases: TestCaseNode[];
    selectedRunId: string | null;
    setSelectedRunId: (id: string) => void;
    calcRunProgress: (runId: string) => number;
}

const RunList: FC<RunListProps> = ({ runs, testCases, selectedRunId, setSelectedRunId, calcRunProgress }) => {
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
                stats[tc.run_id].total++;
                if (tc.status === 'PASS') stats[tc.run_id].pass++;
                else if (tc.status === 'FAIL') stats[tc.run_id].fail++;
                else if (tc.status === 'RUNNING') stats[tc.run_id].running++;
            }
        });
        return stats;
    }, [runs, testCases]);

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

    return (
        <div className="flex flex-col bg-bg-card rounded-[8px] border border-border-color overflow-hidden h-full shadow-[0_4px_16px_rgba(0,0,0,0.15)] transition-all duration-300">

            {/* Header */}
            <div className="bg-bg-panel border-b border-border-color p-[15px] font-semibold flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.2)] shrink-0 gap-[10px]">
                <div className="flex justify-between items-center">
                    <div className="flex items-center text-[14px]">
                        Available Runs
                    </div>
                    <span className="bg-white/10 text-[11px] px-2 py-0.5 rounded-[12px] text-text-muted">
                        {filteredRuns.length}
                    </span>
                </div>

                {/* Search */}
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
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-[10px] bg-bg-card custom-scrollbar">
                {filteredRuns.length === 0 ? (
                    <div className="text-center p-4 text-text-muted italic text-[13px]">
                        No execution data.
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

                                {/* Progress Bar Container within card */}
                                <div className="h-[4px] bg-border-color rounded-[2px] overflow-hidden relative z-10 w-full mt-2">
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
        </div>
    );
};

export default RunList;
