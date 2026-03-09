export const getEffectiveStatus = (rawStatus: string, childEffectiveStatuses: string[] = []): string => {

    // If the parent itself has failed, the effective status is FAIL regardless of children
    if (rawStatus === 'FAIL') return 'FAIL';

    // If the API already reports PASS, we accept it as PASS
    if (rawStatus === 'PASS') return 'PASS';

    // If the parent execution is currently running, return RUNNING
    if (rawStatus === 'RUNNING') return 'RUNNING';

    // If the parent is marked as FINISHED by the API,
    // we verify if any child actually failed
    if (rawStatus === 'FINISHED') {

        // If any child has FAIL status, propagate the failure to the parent
        if (childEffectiveStatuses.includes('FAIL'))
            return 'FAIL';

        // Otherwise the execution is considered successful
        else
            return 'PASS';
    }


    // Previously this handled cases where a child RUNNING should propagate to parent,
    // but it has been intentionally disabled
    // if (rawStatus === 'RUNNING' || childEffectiveStatuses.includes('RUNNING')) return 'RUNNING';


    // Fallback: return the raw status if none of the above conditions match
    return rawStatus;
};