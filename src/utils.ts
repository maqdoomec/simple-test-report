export const getEffectiveStatus = (baseStatus: string, childStatuses: string[]) => {
    if (baseStatus === 'RUNNING' || childStatuses.includes('RUNNING')) return 'RUNNING';
    if (baseStatus !== 'FINISHED') return baseStatus;
    // FINISHED: derive outcome from children
    const normChildren = childStatuses.map(s => s === 'FINISHED' ? 'PASS' : s);
    return normChildren.includes('FAIL') ? 'FAIL' : 'PASS';
};
