import { useState, useEffect, useRef, useMemo, type FC } from 'react';

export interface ValidationItem {
    status: 'PASS' | 'FAIL' | 'RUNNING' | 'PENDING';
    run_id: string;
    testcase_id?: string;
    testcase_name?: string;
    process_id?: string;
    process_name?: string;
    subprocess_id?: string;
    subprocess_name?: string;
    expected?: string;
    Expected?: string;
    actual?: string;
    Actual?: string;
    Difference?: string;
    error?: string;
    timestamp?: string;
    time?: string;
    message?: string;
    validation_name?: string;
}

interface ValidationStreamProps {
    validations: ValidationItem[];
    isCollapsed: boolean;
    toggleCollapse: () => void;
    emptyMessage: string;
}

type StatusFilter = 'ALL' | 'PASS' | 'FAIL';

const ValidationStream: FC<ValidationStreamProps> = ({ validations, isCollapsed, toggleCollapse, emptyMessage }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [searchValue, setSearchValue] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');

    // Auto-scroll to bottom
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [validations]);

    const filteredValidations = useMemo(() => {
        return validations.filter(v => {
            if (statusFilter !== 'ALL' && v.status !== statusFilter) return false;
            if (searchValue) {
                const q = searchValue.toLowerCase();
                const haystack = [
                    v.testcase_name, v.testcase_id,
                    v.process_name, v.process_id,
                    v.subprocess_name, v.subprocess_id,
                    v.message, v.validation_name,
                    v.expected, v.Expected,
                    v.actual, v.Actual,
                    v.error
                ].filter(Boolean).join(' ').toLowerCase();
                if (!haystack.includes(q)) return false;
            }
            return true;
        });
    }, [validations, statusFilter, searchValue]);

    const hasFailures = validations.some(v => v.status === 'FAIL');
    const passCount = validations.filter(v => v.status === 'PASS').length;
    const failCount = validations.filter(v => v.status === 'FAIL').length;

    return (
        <div className={`flex flex-col bg-bg-card rounded-xl border border-border-medium overflow-hidden h-full relative transition-all duration-300 ${isCollapsed ? 'opacity-90 cursor-pointer hover:border-text-muted hover:bg-white/5 items-center' : ''}`} onClick={isCollapsed ? toggleCollapse : undefined}>

            {/* Header */}
            <div className={`bg-bg-card border-b border-border-medium p-3 flex items-center shadow-md relative z-10 ${isCollapsed ? 'justify-center border-none p-4' : 'justify-between'}`}>
                <button
                    onClick={(e) => { e.stopPropagation(); toggleCollapse(); }}
                    className="bg-bg-panel border border-border-medium rounded-md w-7 h-7 flex items-center justify-center text-text-muted cursor-pointer transition-all duration-200 hover:text-text-main hover:bg-white/10 z-20"
                    title={isCollapsed ? "Expand Validation Stream" : "Collapse Validation Stream"}
                >
                    {isCollapsed ? '◀' : '▶'}
                </button>

                {!isCollapsed && (
                    <>
                        <span className="flex-1 text-center font-semibold text-text-main uppercase tracking-wider text-xs">
                            Validation Stream
                        </span>
                        <span className="text-[11px] text-text-muted font-normal">(Auto)</span>
                    </>
                )}
            </div>

            {/* Collapsed Vertical Text & Indicator */}
            {isCollapsed && (
                <div className="flex-1 flex flex-col items-center py-4 relative w-full">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] text-center rotate-90 text-[11px] font-bold tracking-[3px] text-text-muted uppercase pointer-events-none origin-center whitespace-nowrap">
                        Validations
                    </div>
                    {hasFailures && (
                        <div className="absolute top-4 w-3 h-3 rounded-full bg-status-fail shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-pulse" title="New validation failures detected"></div>
                    )}
                </div>
            )}

            {/* Filter Bar (expanded only) */}
            {!isCollapsed && (
                <div className="px-3 py-2 bg-white/[0.02] border-b border-border-light flex flex-col gap-2 shrink-0">
                    {/* Search */}
                    <div className="flex items-center bg-bg-main border border-border-medium rounded px-2 focus-within:border-accent-primary focus-within:shadow-[0_0_0_1px_rgba(99,102,241,0.5)] transition-all h-[28px]">
                        <span className="text-text-muted opacity-50 mr-1.5 text-[13px] shrink-0">🔍</span>
                        <input
                            type="text"
                            placeholder="Search validations…"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="flex-1 bg-transparent border-none text-[11px] py-0 text-text-main placeholder-text-muted focus:outline-none min-w-0"
                        />
                        {searchValue && (
                            <button
                                onClick={() => setSearchValue('')}
                                className="text-text-muted hover:text-text-main text-[14px] bg-transparent ml-1"
                            >×</button>
                        )}
                    </div>

                    {/* Status filter tabs + counts */}
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => setStatusFilter('ALL')}
                            className={`px-2.5 py-[2px] rounded text-[10px] font-bold tracking-wider border transition-all duration-150 ${statusFilter === 'ALL'
                                ? 'border-accent-primary text-accent-primary bg-accent-primary/10'
                                : 'border-border-medium text-text-muted hover:border-text-main bg-bg-main'}`}
                        >
                            All ({validations.length})
                        </button>
                        <button
                            onClick={() => setStatusFilter('PASS')}
                            className={`px-2.5 py-[2px] rounded text-[10px] font-bold tracking-wider border transition-all duration-150 ${statusFilter === 'PASS'
                                ? 'border-status-pass text-status-pass bg-status-pass/10'
                                : 'border-border-medium text-text-muted hover:border-status-pass/50 bg-bg-main'}`}
                        >
                            ✓ {passCount}
                        </button>
                        <button
                            onClick={() => setStatusFilter('FAIL')}
                            className={`px-2.5 py-[2px] rounded text-[10px] font-bold tracking-wider border transition-all duration-150 ${statusFilter === 'FAIL'
                                ? 'border-status-fail text-status-fail bg-status-fail/10'
                                : 'border-border-medium text-text-muted hover:border-status-fail/50 bg-bg-main'}`}
                        >
                            ✕ {failCount}
                        </button>

                        {/* Filtered count indicator */}
                        {(statusFilter !== 'ALL' || searchValue) && (
                            <span className="ml-auto text-[10px] text-text-muted">
                                {filteredValidations.length} shown
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Expanded Content Area */}
            {!isCollapsed && (
                <div ref={containerRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar scroll-smooth">
                    {filteredValidations.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-text-muted text-[13px] gap-3 py-8">
                            <svg className="w-10 h-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>{validations.length === 0 ? emptyMessage : 'No validations match your filter'}</span>
                            {(statusFilter !== 'ALL' || searchValue) && validations.length > 0 && (
                                <button
                                    onClick={() => { setStatusFilter('ALL'); setSearchValue(''); }}
                                    className="text-accent-primary text-[11px] hover:underline bg-transparent"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    ) : (
                        filteredValidations.map((val, idx) => {
                            const acClass = val.status === 'PASS' ? 'text-status-pass' : 'text-status-fail';
                            const err = val.error ? <div className="text-status-fail mt-1.5 text-[11px]">⚠ {val.error}</div> : null;

                            let contextStr = 'Validation Step';
                            if (val.testcase_id) {
                                const parts = [
                                    val.testcase_name || val.testcase_id,
                                    val.process_name || val.process_id,
                                    val.subprocess_name || val.subprocess_id
                                ].filter(Boolean);
                                contextStr = parts.join(' › ');
                            }

                            const expectedStr = val.Expected !== undefined ? val.Expected : (val.expected || '--');
                            const actualStr = val.Actual !== undefined ? val.Actual : (val.actual || '--');

                            const dispTime = val.timestamp || val.time;
                            const formattedTime = dispTime ? new Date(
                                dispTime.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1-$2-$3T$4:$5:$6")
                            ).toLocaleTimeString([], { hour12: false }) : '';

                            const dispMsg = val.message || val.validation_name || 'Validation Result';

                            return (
                                <div key={idx} className={`bg-bg-panel p-3 rounded-lg border-l-4 shadow-sm text-sm break-words transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${val.status === 'PASS' ? 'border-status-pass' : 'border-status-fail'}`}>
                                    <div className="flex justify-between items-start mb-1.5 gap-2">
                                        <span className="font-semibold text-text-main">[{formattedTime}] {dispMsg}</span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-sm shrink-0 ${val.status === 'PASS' ? 'bg-status-pass' : val.status === 'FAIL' ? 'bg-status-fail' : 'bg-status-info'}`}>
                                            {val.status}
                                        </span>
                                    </div>
                                    {contextStr && <div className="mb-1"><span className="text-text-muted text-[10px]">{contextStr}</span></div>}
                                    <div className="bg-bg-main p-2 rounded text-[13px] text-text-main/90 border border-border-light flex flex-col gap-1 mt-2">
                                        {expectedStr !== '--' && expectedStr !== '' && <div><span className="text-text-muted font-medium w-20 inline-block">Expected:</span> {expectedStr}</div>}
                                        {actualStr !== '--' && actualStr !== '' && <div><span className={`${acClass} font-medium w-20 inline-block`}>Actual:</span> {actualStr}</div>}
                                        {val.Difference && <div><span className="text-status-fail text-[10px]">Diff: {val.Difference}</span></div>}
                                        {err}
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

export default ValidationStream;
