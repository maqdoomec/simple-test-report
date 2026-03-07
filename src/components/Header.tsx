import type { FC } from 'react';

interface HeaderProps {
    useMockData: boolean;
    toggleMockData: () => void;
    resetTypes: () => void;
    isPaused: boolean;
    togglePause: () => void;
    exportCSV: () => void;
    apiStatus: 'online' | 'offline';
    theme: 'dark' | 'light';
    toggleTheme: () => void;
}

const Header: FC<HeaderProps> = ({
    useMockData,
    toggleMockData,
    resetTypes,
    isPaused,
    togglePause,
    exportCSV,
    apiStatus,
    theme,
    toggleTheme
}) => {
    return (
        <header className="flex justify-between items-center mb-5 pb-[15px] border-b border-border-medium flex-wrap gap-[10px]">
            <h1 className="text-[22px] font-bold tracking-[0.5px] m-0 flex items-center gap-2 text-text-main" style={theme === 'dark' ? { background: 'linear-gradient(90deg, #e4e6ef, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : {}}>
                <span style={theme === 'dark' ? { WebkitTextFillColor: 'initial', color: 'initial' } : {}}>⚡</span>
                Tricentis Tosca Execution Dashboard
            </h1>

            {/* Right Side Controls */}
            <div className="flex items-center gap-4 flex-wrap">

                {/* API Status */}
                <div className={`flex items-center gap-1.5 text-[12px] px-2.5 py-[5px] rounded-[20px] border ${apiStatus === 'online' ? 'border-status-pass/30' : 'border-status-fail/30'}`}>
                    <div className={`w-2 h-2 rounded-full ${apiStatus === 'online' ? 'bg-status-pass shadow-[0_0_6px_var(--color-status-pass)] animate-pulse-green' : 'bg-status-fail'}`}></div>
                    <span className="text-text-main font-semibold">
                        {apiStatus === 'online' ? 'Live' : 'Offline'}
                    </span>
                </div>

                <span className="text-[12px] text-text-muted font-medium">Updated: {new Date().toLocaleTimeString()}</span>

                {/* Buttons */}
                <div className="flex gap-2">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="px-[14px] py-[6px] rounded-[6px] border bg-bg-card border-border-medium text-text-main text-[12px] font-sans flex items-center gap-[5px] hover:bg-bg-card-hover transition-all duration-200"
                        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                    >
                        {theme === 'dark' ? (
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        ) : (
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        )}
                    </button>

                    <button
                        onClick={togglePause}
                        disabled={useMockData}
                        className={`px-[14px] py-[6px] rounded-[6px] border text-[12px] font-sans flex items-center gap-[5px] transition-all duration-200 ${isPaused
                            ? 'bg-status-running/15 border-status-running text-status-running font-semibold'
                            : 'bg-bg-card border-border-medium hover:bg-bg-card-hover text-text-main font-semibold'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isPaused ? '▶ Resume' : '⏸ Pause'}
                    </button>

                    <button
                        onClick={toggleMockData}
                        className={`px-[14px] py-[6px] rounded-[6px] border text-[12px] font-sans flex items-center gap-[5px] transition-all duration-200 cursor-pointer ${useMockData
                            ? 'bg-status-pass/15 border-status-pass/40 text-status-pass font-semibold'
                            : 'bg-text-muted/10 border-text-muted/30 text-text-muted font-semibold'
                            }`}
                    >
                        <span className="mr-1">🧪</span> Mock: {useMockData ? 'ON' : 'OFF'}
                    </button>

                    <button
                        onClick={resetTypes}
                        disabled={useMockData}
                        title="Delete all execution data and recreate base types in TDS repository"
                        className="px-[14px] py-[6px] rounded-[6px] border bg-[#ffa000]/12 border-[#ffa000]/40 text-[#b45309] dark:text-[#ffa000] text-[12px] font-sans flex items-center gap-[5px] hover:bg-[#ffa000]/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    >
                        <span className="mr-1">↺</span> Reset Types
                    </button>

                    <button
                        onClick={exportCSV}
                        className="px-[14px] py-[6px] rounded-[6px] border bg-accent-primary/15 border-accent-primary/40 text-text-main text-[12px] font-sans flex items-center gap-[5px] hover:bg-accent-primary/30 transition-all duration-200 font-semibold"
                    >
                        <span className="mr-1 shrink-0">⬇</span> Export CSV
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
