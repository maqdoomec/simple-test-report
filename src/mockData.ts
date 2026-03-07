import type { RunNode, TestCaseNode, ProcessNode, SubProcessNode } from './components/ProcessTree';
import type { ValidationItem } from './components/ValidationStream';

export const mockRuns: { data: RunNode }[] = [
    { data: { run_id: 'RUN-1001', run_name: 'E2E_OrderToInvoice _Regression', status: 'RUNNING' } },
    { data: { run_id: 'RUN-1002', run_name: 'Retail_Shipping_Full_Suite', status: 'FAIL' } },
    { data: { run_id: 'RUN-1003', run_name: 'BOM_Dashboard_Smoke', status: 'PASS' } },
    { data: { run_id: 'RUN-1004', run_name: 'Pre_Conditions_Baseline', status: 'PENDING' } }
];

export const mockTestCases: { data: TestCaseNode }[] = [
    { data: { run_id: 'RUN-1001', testcase_id: 'TC-101', testcase_name: 'Environment Cleanup', status: 'PASS' } },
    { data: { run_id: 'RUN-1001', testcase_id: 'TC-102', testcase_name: 'Create Customer Profile', status: 'RUNNING' } },
    { data: { run_id: 'RUN-1002', testcase_id: 'TC-201', testcase_name: 'Verify API Sync', status: 'FAIL' } },
    { data: { run_id: 'RUN-1002', testcase_id: 'TC-202', testcase_name: 'Login via SSO', status: 'PASS' } },
    { data: { run_id: "RUN-1003", testcase_id: "TC-301", testcase_name: "BOM_Visualizer_Load_Test", status: "PASS" } },
    { data: { run_id: "RUN-1003", testcase_id: "TC-302", testcase_name: "Assembly_Dashboard_Smoke", status: "PASS" } }
];

export const mockProcesses: { data: ProcessNode }[] = [
    { data: { run_id: "RUN-1001", testcase_id: "TC-101", process_id: "P-001", process_name: "Pre-Conditions", status: "PASS" } },
    { data: { run_id: "RUN-1001", testcase_id: "TC-101", process_id: "P-002", process_name: "Book Order", status: "RUNNING" } },
    { data: { run_id: "RUN-1001", testcase_id: "TC-101", process_id: "P-003", process_name: "Dashboards & BOM", status: "PENDING" } },
    { data: { run_id: "RUN-1001", testcase_id: "TC-101", process_id: "P-004", process_name: "Post Order Process", status: "PENDING" } },
    { data: { run_id: "RUN-1002", testcase_id: "TC-201", process_id: "P-011", process_name: "Pre-Conditions", status: "PASS" } },
    { data: { run_id: "RUN-1002", testcase_id: "TC-201", process_id: "P-012", process_name: "Book Order", status: "PASS" } },
    { data: { run_id: "RUN-1002", testcase_id: "TC-201", process_id: "P-013", process_name: "Dashboards & BOM", status: "PASS" } },
    { data: { run_id: "RUN-1002", testcase_id: "TC-201", process_id: "P-014", process_name: "Post Order Process", status: "FAIL" } },
    { data: { run_id: "RUN-1003", testcase_id: "TC-301", process_id: "P-021", process_name: "Pre-Conditions", status: "PASS" } },
    { data: { run_id: "RUN-1003", testcase_id: "TC-301", process_id: "P-022", process_name: "Dashboards & BOM", status: "PASS" } }
];

export const mockSubProcesses: { data: SubProcessNode }[] = [
    { data: { run_id: "RUN-1001", testcase_id: "TC-101", process_id: "P-001", subprocess_id: "SP-001", subprocess_name: "Environment Cleanup", status: "PASS" } },
    { data: { run_id: "RUN-1001", testcase_id: "TC-101", process_id: "P-001", subprocess_id: "SP-002", subprocess_name: "Data Setup", status: "PASS" } },
    { data: { run_id: "RUN-1001", testcase_id: "TC-101", process_id: "P-001", subprocess_id: "SP-003", subprocess_name: "Login", status: "PASS" } },
    { data: { run_id: "RUN-1001", testcase_id: "TC-101", process_id: "P-002", subprocess_id: "SP-004", subprocess_name: "Order Creation", status: "PASS" } },
    { data: { run_id: "RUN-1001", testcase_id: "TC-101", process_id: "P-002", subprocess_id: "SP-005", subprocess_name: "Belt Configuration", status: "RUNNING" } },
    { data: { run_id: "RUN-1001", testcase_id: "TC-101", process_id: "P-002", subprocess_id: "SP-006", subprocess_name: "Validation & Booking", status: "PENDING" } },
    { data: { run_id: "RUN-1001", testcase_id: "TC-101", process_id: "P-003", subprocess_id: "SP-007", subprocess_name: "BOM Visualizer", status: "PENDING" } },
    { data: { run_id: "RUN-1001", testcase_id: "TC-101", process_id: "P-003", subprocess_id: "SP-008", subprocess_name: "Assembly Dashboard", status: "PENDING" } },
    { data: { run_id: "RUN-1001", testcase_id: "TC-101", process_id: "P-003", subprocess_id: "SP-009", subprocess_name: "Shipping Dashboard", status: "PENDING" } },
    { data: { run_id: "RUN-1002", testcase_id: "TC-201", process_id: "P-011", subprocess_id: "SP-101", subprocess_name: "Environment Cleanup", status: "PASS" } },
    { data: { run_id: "RUN-1002", testcase_id: "TC-201", process_id: "P-014", subprocess_id: "SP-113", subprocess_name: "Auto-Invoice Gen", status: "FAIL" } },
    { data: { run_id: "RUN-1003", testcase_id: "TC-301", process_id: "P-021", subprocess_id: "SP-201", subprocess_name: "Environment Cleanup", status: "PASS" } },
];

export const mockValidations: { data: ValidationItem }[] = [
    {
        data: {
            run_id: 'RUN-1001', testcase_id: "TC-101", process_id: "P-001", subprocess_id: "SP-003",
            status: 'PASS', timestamp: '20231024100211',
            message: 'Login Success', Expected: 'Logged In', Actual: 'Logged In'
        }
    },
    {
        data: {
            run_id: 'RUN-1001', testcase_id: "TC-101", process_id: "P-002", subprocess_id: "SP-004",
            status: 'PASS', timestamp: '20231024100834',
            message: 'Order Number != Null', Expected: '!= Null', Actual: 'ORD-884421'
        }
    },
    {
        data: {
            run_id: 'RUN-1001', testcase_id: "TC-101", process_id: "P-002", subprocess_id: "SP-005",
            status: 'FAIL', timestamp: '20231024101102',
            message: 'Invoice Total Mismatch', Expected: '$1,240.50', Actual: '$1,240.00',
            Difference: '-$0.50'
        }
    },
    {
        data: {
            run_id: 'RUN-1002', testcase_id: "TC-201", process_id: "P-014", subprocess_id: "SP-110",
            status: 'FAIL', timestamp: '20231024083100',
            message: 'API Sync Error', Expected: 'status 200', Actual: 'status 500'
        }
    }
];
