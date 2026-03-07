import type { FC } from 'react';

interface StatCardsProps {
    totalRuns: number;
    totalPassed: number;
    totalFailed: number;
    totalRunning: number;
    totalPending: number;
    passRate: string;
    passRateNum: number;
}

const StatCards: FC<StatCardsProps> = ({
    totalRuns,
    totalPassed,
    totalFailed,
    totalRunning,
    totalPending,
    passRate,
    passRateNum
}) => {
    const C = 82;
    const totalFinished = totalPassed + totalFailed;
    // In legacy, the fail circle was full if there were any finishes, and the pass circle was overlaid.
    const failDash = totalFinished > 0 ? ((totalPassed + totalFailed) / totalFinished) * C : 0;
    const passDash = passRateNum > 0 ? (passRateNum / 100) * C : 0;

    return (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-[16px] mb-5">
            {/* Total Runs */}
            <div className="relative overflow-hidden bg-bg-card rounded-xl px-5 py-[18px] border border-border-medium text-center backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:before:opacity-100 before:absolute before:inset-0 before:rounded-xl before:opacity-0 before:transition-opacity before:duration-300 before:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent)]">
                <div className="text-text-muted text-[11px] uppercase tracking-[1px] mb-2.5 font-medium">TOTAL RUNS</div>
                <div className="text-[34px] font-bold leading-none text-text-main">{totalRuns}</div>
            </div>

            {/* Passed */}
            <div className="relative overflow-hidden bg-bg-card rounded-xl px-5 py-[18px] border border-border-medium text-center backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:before:opacity-100 before:absolute before:inset-0 before:rounded-xl before:opacity-0 before:transition-opacity before:duration-300 before:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent)]">
                <div className="text-text-muted text-[11px] uppercase tracking-[1px] mb-2.5 font-medium">PASSED</div>
                <div className="text-[34px] font-bold leading-none text-status-pass">{totalPassed}</div>
            </div>

            {/* Failed */}
            <div className="relative overflow-hidden bg-bg-card rounded-xl px-5 py-[18px] border border-border-medium text-center backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:before:opacity-100 before:absolute before:inset-0 before:rounded-xl before:opacity-0 before:transition-opacity before:duration-300 before:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent)]">
                <div className="text-text-muted text-[11px] uppercase tracking-[1px] mb-2.5 font-medium">FAILED</div>
                <div className="text-[34px] font-bold leading-none text-status-fail">{totalFailed}</div>
            </div>

            {/* Running */}
            <div className="relative overflow-hidden bg-bg-card rounded-xl px-5 py-[18px] border border-border-medium text-center backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:before:opacity-100 before:absolute before:inset-0 before:rounded-xl before:opacity-0 before:transition-opacity before:duration-300 before:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent)]">
                <div className="text-text-muted text-[11px] uppercase tracking-[1px] mb-2.5 font-medium">RUNNING</div>
                <div className="text-[34px] font-bold leading-none text-status-running">{totalRunning}</div>
            </div>

            {/* Pending */}
            <div className="relative overflow-hidden bg-bg-card rounded-xl px-5 py-[18px] border border-border-medium text-center backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:before:opacity-100 before:absolute before:inset-0 before:rounded-xl before:opacity-0 before:transition-opacity before:duration-300 before:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent)]">
                <div className="text-text-muted text-[11px] uppercase tracking-[1px] mb-2.5 font-medium">PENDING</div>
                <div className="text-[34px] font-bold leading-none text-status-pending">{totalPending}</div>
            </div>

            {/* Pass Rate Chart */}
            <div className="relative overflow-hidden bg-bg-card rounded-xl px-5 py-[18px] border border-border-medium text-center backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:before:opacity-100 before:absolute before:inset-0 before:rounded-xl before:opacity-0 before:transition-opacity before:duration-300 before:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent)]">
                <div className="text-text-muted text-[11px] uppercase tracking-[1px] mb-2.5 font-medium">PASS RATE</div>
                <div className="flex flex-col items-center gap-[8px]">
                    <svg className="w-[80px] h-[80px]" viewBox="0 0 36 36">
                        <circle className="stroke-border-medium" cx="18" cy="18" r="13" fill="none" strokeWidth="10" transform="rotate(-90 18 18)" />
                        <circle className="stroke-status-fail transition-all duration-500 ease" cx="18" cy="18" r="13" fill="none" strokeWidth="10" transform="rotate(-90 18 18)" style={{ strokeDasharray: `${failDash} 82` }} />
                        <circle className="stroke-status-pass transition-all duration-500 ease" cx="18" cy="18" r="13" fill="none" strokeWidth="10" transform="rotate(-90 18 18)" style={{ strokeDasharray: `${passDash} 82` }} />
                    </svg>
                    <div className="text-[11px] font-bold text-accent-primary leading-none">{passRate}</div>
                </div>
            </div>
        </div>
    );
};

export default StatCards;
