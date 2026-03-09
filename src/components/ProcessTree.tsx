import type { FC } from 'react';
import { getEffectiveStatus } from '../utils';

// Type Definitions
export interface RunNode {
    run_id: string;
    run_name: string;
    status: string;
}

export interface TestCaseNode {
    testcase_id: string;
    testcase_name: string;
    status: string;
    run_id: string;
}

export interface ProcessNode {
    process_id: string;
    process_name: string;
    status: string;
    testcase_id: string;
    run_id: string;
}

export interface SubProcessNode {
    subprocess_id: string;
    subprocess_name: string;
    status: string;
    process_id: string;
    testcase_id: string;
    run_id: string;
}

import type { ValidationItem } from './ValidationStream';

export type SelectedNode = {
    type: 'tc' | 'proc' | 'sp';
    tcId: string;
    procId?: string;
    spId?: string;
    runId: string;
} | null;

interface ProcessTreeProps {
    run: RunNode | null;
    testCases: TestCaseNode[];
    processes: ProcessNode[];
    subProcesses: SubProcessNode[];
    statusMap: Map<string, string>;
    selectedNode: SelectedNode;
    setSelectedNode: (node: SelectedNode) => void;
    collapsedNodes: Record<string, boolean>;
    toggleNodeCollapse: (nodeId: string) => void;
    collapseAll: () => void;
    expandAll: () => void;
}

const ProcessTree: FC<ProcessTreeProps> = ({
    run,
    testCases,
    processes,
    subProcesses,
    statusMap,
    selectedNode,
    setSelectedNode,
    collapsedNodes,
    toggleNodeCollapse,
    collapseAll,
    expandAll
}) => {

    if (!run) {
        return (
            <div className="flex flex-col min-h-0 bg-bg-card rounded-xl border border-border-medium h-full shadow-lg">
                <div className="bg-bg-panel border-b border-border-medium p-[15px] font-semibold flex items-center shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
                    <svg className="w-[18px] h-[18px] mr-2 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    Process Tree
                </div>
                <div className="flex flex-col items-center justify-center p-8 text-text-muted text-[13px] gap-3 bg-bg-card">
                    <svg className="w-10 h-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                    <span>Select a run to inspect</span>
                </div>
            </div>
        );
    }

    // Calculate run completion metrics
    const tcCount = testCases.length;
    const tcFinished = testCases.filter(t => {
        const procStatuses = processes.filter(p => p.testcase_id === t.testcase_id).map(p => p.status);
        const eff = getEffectiveStatus(t.status, procStatuses);
        return eff === 'PASS' || eff === 'FAIL';
    }).length;
    const pct = tcCount === 0 ? 0 : Math.round((tcFinished / tcCount) * 100);

    // Monitor compact strip data
    const activeTC = testCases.find(t => (statusMap.get(`${t.run_id}:${t.testcase_id}`) || t.status) === 'RUNNING') || testCases[testCases.length - 1];
    const activeProc = activeTC ? processes.find(p => p.testcase_id === activeTC.testcase_id && (statusMap.get(`${p.run_id}:${p.process_id}`) || p.status) === 'RUNNING') || processes.filter(p => p.testcase_id === activeTC.testcase_id).pop() : null;

    const isNodeSelected = (type: string, id: string) => {
        if (!selectedNode) return false;
        if (type === 'tc') return selectedNode.type === 'tc' && selectedNode.tcId === id;
        if (type === 'proc') return selectedNode.type === 'proc' && selectedNode.procId === id;
        if (type === 'sp') return selectedNode.type === 'sp' && selectedNode.spId === id;
        return false;
    };

    return (
        <div className="flex flex-col min-h-0 bg-bg-card rounded-xl border border-border-medium h-full shadow-lg transition-all duration-300">

            {/* Header */}
            <div className="bg-bg-panel border-b border-border-medium p-[15px] font-semibold flex items-center shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
                <svg className="w-[18px] h-[18px] mr-2 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <div className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis mr-2">
                    Process Tree
                </div>
                <div className="flex items-center gap-1.5 mr-2">
                    <button
                        onClick={expandAll}
                        className="p-1 rounded text-text-muted hover:text-text-main hover:bg-white/10 transition-colors"
                        title="Expand All"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7M19 4l-7 7-7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={collapseAll}
                        className="p-1 rounded text-text-muted hover:text-text-main hover:bg-white/10 transition-colors"
                        title="Collapse All"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7M5 20l7-7 7 7" />
                        </svg>
                    </button>
                </div>
                {(() => {
                    const effRunStatus = statusMap.get(run.run_id) || run.status;
                    return (
                        <div className={`px-2 py-0.5 rounded text-[10px] font-bold text-white shadow shadow-black/20 ${effRunStatus === 'PASS' ? 'bg-status-pass' :
                            effRunStatus === 'FAIL' ? 'bg-status-fail' :
                                effRunStatus === 'RUNNING' ? 'bg-status-running text-black animate-blink-running' : 'bg-status-pending'
                            }`}>
                            {effRunStatus}
                        </div>
                    );
                })()}
            </div>

            {/* Monitor Compact Strip */}
            <div className="flex items-center gap-2.5 px-2.5 py-1.5 bg-black/20 text-[12px] overflow-hidden whitespace-nowrap shrink-0 mx-3 mt-2 rounded-[7px]">
                <span className="text-text-muted">Run:</span>
                <span className="text-accent-primary font-semibold truncate max-w-[30%]">{run.run_id}</span>
                {activeTC && (
                    <>
                        <span className="text-text-muted">│</span>
                        <span className="text-text-muted">TC:</span>
                        <span className="text-text-main font-medium truncate max-w-[25%]">{activeTC.testcase_name || activeTC.testcase_id}</span>
                    </>
                )}
                {activeProc && (
                    <>
                        <span className="text-text-muted">│</span>
                        <span className="text-text-muted">Proc:</span>
                        <span className="text-text-main font-medium truncate max-w-[25%]">{activeProc.process_name || activeProc.process_id}</span>
                    </>
                )}
            </div>

            {/* Info Bar */}
            <div className="px-4 py-3 bg-white/[0.02] border-b border-border-light text-sm flex flex-col gap-1.5 shadow-inner">
                <div className="flex justify-between font-mono text-accent-primary font-bold">
                    <span>{run.run_id}</span>
                </div>
                <div className="text-[13px] text-text-main opacity-90 break-words">{run.run_name}</div>
                <div className="flex justify-between items-center text-[11px] text-text-muted mt-1">
                    <span>SubProcess Progress</span>
                    <span>{pct}%</span>
                </div>
            </div>

            {/* Progress Bar - 10px height matching reference */}
            <div className="h-2.5 bg-border-medium w-full overflow-hidden rounded-[6px] mx-0 shrink-0" style={{ margin: '12px 0' }}>
                {(() => {
                    const effRunStatus = statusMap.get(run.run_id) || run.status;
                    return (
                        <div
                            className={`h-full rounded-[6px] transition-all duration-500 ease-out ${effRunStatus === 'PASS' ? 'bg-status-pass shadow-status-pass/50' : effRunStatus === 'FAIL' ? 'bg-status-fail shadow-status-fail/50' : effRunStatus === 'RUNNING' ? 'bg-status-running animate-shimmer' : 'bg-status-pending'}`}
                            style={{
                                width: `${pct}%`,
                                backgroundImage: effRunStatus === 'RUNNING' ? 'linear-gradient(90deg, var(--color-status-running), #ff9900, var(--color-status-running))' : 'none',
                                backgroundSize: effRunStatus === 'RUNNING' ? '200% 100%' : 'auto'
                            }}
                        />
                    );
                })()}
            </div>

            {/* Tree Content */}
            <div className="flex-1 min-h-0 overflow-y-auto p-3 pb-6 text-[13px] custom-scrollbar scroll-smooth">
                {testCases.map(tc => {
                    const tcId = tc.testcase_id;
                    const isCollapsed = collapsedNodes[tcId];
                    const tcProcs = processes.filter(p => p.testcase_id === tcId && p.run_id === run.run_id);
                    const hasChildren = tcProcs.length > 0;

                    // We use the centralized bottom-up statusMap
                    const tcStatus = statusMap.get(`${tc.run_id}:${tc.testcase_id}`) || tc.status;

                    return (
                        <div key={tcId} className="mb-2">
                            {/* TestCase Row */}
                            <div
                                className={`flex items-center p-3 rounded-md cursor-pointer transition-all duration-200 border-l-[3px] border-transparent mb-1 ${isNodeSelected('tc', tcId)
                                    ? 'bg-accent-primary/20 border-l-accent-primary shadow-[inset_0_0_10px_rgba(99,102,241,0.1)]'
                                    : 'bg-white/5 hover:bg-white/10'
                                    }`}
                                onClick={() => setSelectedNode({ type: 'tc', tcId, runId: run.run_id })}
                            >
                                {/* Status Dot */}
                                <span className={`w-2.5 h-2.5 rounded-full mr-3 shrink-0 ${tcStatus === 'PASS' ? 'bg-status-pass shadow-[0_0_4px_var(--color-status-pass)]' :
                                    tcStatus === 'FAIL' ? 'bg-status-fail shadow-[0_0_4px_var(--color-status-fail)]' :
                                        tcStatus === 'RUNNING' ? 'bg-status-running shadow-[0_0_8px_var(--color-status-running)] animate-pulse-running' : 'bg-status-pending'
                                    }`} />

                                {/* Name */}
                                <span className={`flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-semibold ${tcStatus === 'FAIL' ? 'text-status-fail' : 'text-text-main'}`}>
                                    {tcId}: {tc.testcase_name || 'Unnamed TestCase'}
                                </span>

                                {/* Expand/Collapse (moved to right) */}
                                {hasChildren && (
                                    <span
                                        className="w-5 h-5 flex items-center justify-center ml-2 text-text-muted hover:text-text-main hover:bg-white/10 rounded cursor-pointer transition-colors z-10"
                                        onClick={(e) => { e.stopPropagation(); toggleNodeCollapse(tcId); }}
                                    >
                                        {isCollapsed ? '▶' : '▼'}
                                    </span>
                                )}
                            </div>

                            {/* Processes (Children) */}
                            {!isCollapsed && hasChildren && (
                                <div className="ml-5 pl-2 border-l border-border-light mt-1 flex flex-col gap-1">
                                    {tcProcs.map(proc => {
                                        const procId = proc.process_id;
                                        const pCollapsed = collapsedNodes[procId];
                                        const procSps = subProcesses.filter(s => s.process_id === procId && s.testcase_id === tcId && s.run_id === run.run_id);
                                        const pHasChildren = procSps.length > 0;

                                        const procStatus = statusMap.get(`${proc.run_id}:${proc.process_id}`) || proc.status;

                                        return (
                                            <div key={procId} className="flex flex-col">
                                                <div
                                                    className={`flex items-center p-1.5 rounded-md cursor-pointer transition-colors text-[12px] border border-transparent ${isNodeSelected('proc', procId)
                                                        ? 'bg-accent-primary/10 border-accent-primary/30'
                                                        : 'hover:bg-white-[0.02] hover:border-border-light'
                                                        }`}
                                                    onClick={() => setSelectedNode({ type: 'proc', tcId, procId, runId: run.run_id })}
                                                >
                                                    {pHasChildren ? (
                                                        <span
                                                            className="w-[18px] h-[18px] flex items-center justify-center mr-1 text-text-muted hover:text-text-main hover:bg-white/10 rounded cursor-pointer transition-colors z-10"
                                                            onClick={(e) => { e.stopPropagation(); toggleNodeCollapse(procId); }}
                                                        >
                                                            {pCollapsed ? '▶' : '▼'}
                                                        </span>
                                                    ) : (
                                                        <span className="w-[18px] h-[18px] flex items-center justify-center mr-1 text-border-medium">-</span>
                                                    )}
                                                    <span className={`w-2 h-2 rounded-full mr-1.5 shrink-0 ${procStatus === 'PASS' ? 'bg-status-pass' :
                                                        procStatus === 'FAIL' ? 'bg-status-fail' :
                                                            procStatus === 'RUNNING' ? 'bg-status-running shadow-[0_0_8px_var(--color-status-running)] animate-pulse-running' : 'bg-status-pending'
                                                        }`} />
                                                    <span className={`flex-1 overflow-hidden text-ellipsis whitespace-nowrap opacity-90 ${procStatus === 'FAIL' ? 'text-status-fail opacity-100 font-semibold' : ''}`}>
                                                        {proc.process_name || procId}
                                                    </span>
                                                </div>

                                                {/* SubProcesses (Grandchildren) */}
                                                {!pCollapsed && pHasChildren && (
                                                    <div className="ml-4 pl-2 border-l border-border-light/50 mt-0.5 flex flex-col gap-0.5">
                                                        {procSps.map(sp => {
                                                            const spId = sp.subprocess_id;
                                                            const spStatus = statusMap.get(`${sp.run_id}:${sp.subprocess_id}`) || sp.status;
                                                            return (
                                                                <div
                                                                    key={spId}
                                                                    className={`flex items-center p-1 rounded cursor-pointer transition-colors text-[11px] border border-transparent ${isNodeSelected('sp', spId)
                                                                        ? 'bg-accent-primary/10 border-accent-primary/20'
                                                                        : 'hover:bg-white/5'
                                                                        }`}
                                                                    onClick={() => setSelectedNode({ type: 'sp', tcId, procId, spId, runId: run.run_id })}
                                                                >
                                                                    <span className="w-[14px] h-[14px] flex items-center justify-center mr-1 opacity-0"></span>
                                                                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 shrink-0 ${spStatus === 'PASS' ? 'bg-status-pass' :
                                                                        spStatus === 'FAIL' ? 'bg-status-fail' :
                                                                            spStatus === 'RUNNING' ? 'bg-status-running shadow-[0_0_8px_var(--color-status-running)] animate-pulse-running' : 'bg-status-pending'
                                                                        }`} />
                                                                    <span className={`flex-1 overflow-hidden text-ellipsis whitespace-nowrap opacity-80 ${spStatus === 'FAIL' ? 'text-status-fail opacity-100 font-medium' : ''}`}>
                                                                        {sp.subprocess_name || spId}
                                                                    </span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProcessTree;
