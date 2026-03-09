export const getEffectiveStatus = (rawStatus: string, childEffectiveStatuses: string[] = []): string => {
    // SCENARIO 1: Parent literally failed (e.g., Timeout, Exception).
    // In this case, the parent failed regardless of whatever the children are doing.
    if (rawStatus === 'FAIL') return 'FAIL';

    // SCENARIO 2: A child explicitly failed.
    // Even if the parent finished or is still running, a failed child ruins the parent.
    if (childEffectiveStatuses.includes('FAIL')) return 'FAIL';

    // SCENARIO 3: Parent is explicitly FINISHED (or PASS) by the API.
    // If the API says the parent is FINISHED, but a child is still RUNNING,
    // the child is likely abandoned/orphaned. The parent is officially done.
    if (rawStatus === 'FINISHED' || rawStatus === 'PASS') {
        // If no children failed (checked above), the parent PASSES.
        return 'PASS';
    }

    // SCENARIO 4: Parent is NOT finished.
    // If the parent is PENDING/RUNNING, and ANY child is RUNNING, the parent is RUNNING.
    if (rawStatus === 'RUNNING' || childEffectiveStatuses.includes('RUNNING')) return 'RUNNING';

    // SCENARIO 5: Default fallback (e.g., PENDING without running children)
    return rawStatus;
};
