import type { FC, ReactNode } from 'react';

interface StatCardsProps {
    totalRuns: number;
    totalPassed: number;
    totalFailed: number;
    totalRunning: number;
    totalPending: number;
    passRate: string;
    passRateNum: number;
}

const StatCard: FC<{ label: string; children: ReactNode; glowColor?: string }> = ({ label, children, glowColor }) => (
    <div
        className="relative overflow-hidden bg-bg-card rounded-xl px-5 py-[18px] border border-border-medium text-center backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:before:opacity-100 before:absolute before:inset-0 before:rounded-xl before:opacity-0 before:transition-opacity before:duration-300 before:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent)] group"
        style={{ '--glow-color': glowColor } as React.CSSProperties}
    >
        <div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={glowColor ? { boxShadow: `0 4px 20px ${glowColor}` } : undefined}
        />
        <div className="text-text-muted text-[11px] uppercase tracking-[1px] mb-2.5 font-medium relative z-10">{label}</div>
        <div className="relative z-10">{children}</div>
    </div>
);

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
    const failDash = totalFinished > 0 ? ((totalPassed + totalFailed) / totalFinished) * C : 0;
    const passDash = passRateNum > 0 ? (passRateNum / 100) * C : 0;

    return (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-[16px] mb-5">
            <StatCard label="TOTAL RUNS">
                <div className="text-[34px] font-bold leading-none text-text-main">{totalRuns}</div>
            </StatCard>

            <StatCard label="PASSED" glowColor="rgba(16, 185, 129, 0.15)">
                <div className="text-[34px] font-bold leading-none text-status-pass">{totalPassed}</div>
            </StatCard>

            <StatCard label="FAILED" glowColor="rgba(244, 63, 94, 0.15)">
                <div className="text-[34px] font-bold leading-none text-status-fail">{totalFailed}</div>
            </StatCard>

            <StatCard label="RUNNING" glowColor="rgba(234, 179, 8, 0.15)">
                <div className="text-[34px] font-bold leading-none text-status-running">{totalRunning}</div>
            </StatCard>

            <StatCard label="PENDING">
                <div className="text-[34px] font-bold leading-none text-status-pending">{totalPending}</div>
            </StatCard>

            <StatCard label="PASS RATE" glowColor="rgba(99, 102, 241, 0.15)">
                <div className="flex flex-col items-center gap-[8px]">
                    <svg className="w-[80px] h-[80px]" viewBox="0 0 36 36">
                        <circle className="stroke-border-medium" cx="18" cy="18" r="13" fill="none" strokeWidth="10" transform="rotate(-90 18 18)" />
                        <circle className="stroke-status-fail transition-all duration-500 ease" cx="18" cy="18" r="13" fill="none" strokeWidth="10" transform="rotate(-90 18 18)" style={{ strokeDasharray: `${failDash} 82` }} />
                        <circle className="stroke-status-pass transition-all duration-500 ease" cx="18" cy="18" r="13" fill="none" strokeWidth="10" transform="rotate(-90 18 18)" style={{ strokeDasharray: `${passDash} 82` }} />
                    </svg>
                    <div className="text-[11px] font-bold text-accent-primary leading-none">{passRate}</div>
                </div>
            </StatCard>
        </div>
    );
};

export default StatCards;