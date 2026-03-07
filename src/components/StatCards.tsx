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

interface StatCardProps {
    label: string;
    value: ReactNode;
    color?: string;
    glowColor?: string;
}

const StatCard: FC<StatCardProps> = ({ label, value, glowColor }) => (
    <div
        className="relative overflow-hidden bg-bg-card rounded-xl px-5 py-[18px] border border-border-medium text-center backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 before:absolute before:inset-0 before:rounded-xl before:opacity-0 before:transition-opacity before:duration-300 before:bg-[radial-gradient(circle_at_center,hsla(0,0%,100%,0.05),transparent)] hover:before:opacity-100"
        style={{
            boxShadow: undefined,
        }}
        onMouseEnter={(e) => {
            if (glowColor) e.currentTarget.style.boxShadow = `0 4px 20px ${glowColor}`;
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '';
        }}
    >
        <div className="text-text-muted text-[11px] uppercase tracking-[1px] mb-2.5 font-medium">{label}</div>
        <div className="text-[34px] font-bold leading-none">{value}</div>
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
            <StatCard label="TOTAL RUNS" value={<span className="text-text-main">{totalRuns}</span>} />
            <StatCard label="PASSED" value={<span className="text-status-pass">{totalPassed}</span>} glowColor="hsla(160, 84%, 39%, 0.2)" />
            <StatCard label="FAILED" value={<span className="text-status-fail">{totalFailed}</span>} glowColor="hsla(350, 89%, 60%, 0.2)" />
            <StatCard label="RUNNING" value={<span className="text-status-running">{totalRunning}</span>} glowColor="hsla(45, 93%, 47%, 0.2)" />
            <StatCard label="PENDING" value={<span className="text-status-pending">{totalPending}</span>} />
            <StatCard label="PASS RATE" value={
                <div className="flex flex-col items-center gap-[8px]">
                    <svg className="w-[80px] h-[80px]" viewBox="0 0 36 36">
                        <circle className="stroke-border-medium" cx="18" cy="18" r="13" fill="none" strokeWidth="10" transform="rotate(-90 18 18)" />
                        <circle className="stroke-status-fail transition-all duration-500 ease" cx="18" cy="18" r="13" fill="none" strokeWidth="10" transform="rotate(-90 18 18)" style={{ strokeDasharray: `${failDash} 82` }} />
                        <circle className="stroke-status-pass transition-all duration-500 ease" cx="18" cy="18" r="13" fill="none" strokeWidth="10" transform="rotate(-90 18 18)" style={{ strokeDasharray: `${passDash} 82` }} />
                    </svg>
                    <div className="text-[11px] font-bold text-accent-primary leading-none">{passRate}</div>
                </div>
            } />
        </div>
    );
};

export default StatCards;
