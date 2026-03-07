import type { RunNode, TestCaseNode, ProcessNode, SubProcessNode } from './components/ProcessTree';
import type { ValidationItem } from './components/ValidationStream';

export const mockRuns: { data: RunNode }[] = [
    { data: { run_id: 'RUN-1001', run_name: 'E2E_OrderToInvoice_Regression', status: 'RUNNING' } },
    { data: { run_id: 'RUN-1002', run_name: 'Retail_Shipping_Full_Suite', status: 'FAIL' } },
    { data: { run_id: 'RUN-1003', run_name: 'BOM_Dashboard_Smoke', status: 'PASS' } },
    { data: { run_id: 'RUN-1004', run_name: 'Pre_Conditions_Baseline', status: 'PENDING' } },
    { data: { run_id: 'RUN-1005', run_name: 'Payment_Gateway_Integration', status: 'PASS' } },
    { data: { run_id: 'RUN-1006', run_name: 'User_Auth_Flow_E2E', status: 'PASS' } },
    { data: { run_id: 'RUN-1007', run_name: 'Inventory_Sync_Regression', status: 'FAIL' } },
    { data: { run_id: 'RUN-1008', run_name: 'Report_Export_Suite', status: 'RUNNING' } },
    { data: { run_id: 'RUN-1009', run_name: 'Multi_Currency_Checkout', status: 'PASS' } },
    { data: { run_id: 'RUN-1010', run_name: 'Notification_Service_Smoke', status: 'PENDING' } },
    { data: { run_id: 'RUN-1011', run_name: 'Data_Migration_Validation', status: 'PASS' } },
    { data: { run_id: 'RUN-1012', run_name: 'Search_Indexing_Performance', status: 'FAIL' } },
];

export const mockTestCases: { data: TestCaseNode }[] = [
    { data: { run_id: 'RUN-1001', testcase_id: 'TC-101', testcase_name: 'Environment Cleanup', status: 'PASS' } },
    { data: { run_id: 'RUN-1001', testcase_id: 'TC-102', testcase_name: 'Create Customer Profile', status: 'RUNNING' } },
    { data: { run_id: 'RUN-1001', testcase_id: 'TC-103', testcase_name: 'Order Placement', status: 'PENDING' } },
    { data: { run_id: 'RUN-1001', testcase_id: 'TC-104', testcase_name: 'Invoice Generation', status: 'PENDING' } },
    { data: { run_id: 'RUN-1001', testcase_id: 'TC-105', testcase_name: 'Payment Reconciliation', status: 'PENDING' } },
    { data: { run_id: 'RUN-1002', testcase_id: 'TC-201', testcase_name: 'Verify API Sync', status: 'FAIL' } },
    { data: { run_id: 'RUN-1002', testcase_id: 'TC-202', testcase_name: 'Login via SSO', status: 'PASS' } },
    { data: { run_id: 'RUN-1002', testcase_id: 'TC-203', testcase_name: 'Shipping Label Print', status: 'FAIL' } },
    { data: { run_id: 'RUN-1002', testcase_id: 'TC-204', testcase_name: 'Return Processing', status: 'PASS' } },
    { data: { run_id: 'RUN-1003', testcase_id: 'TC-301', testcase_name: 'BOM_Visualizer_Load_Test', status: 'PASS' } },
    { data: { run_id: 'RUN-1003', testcase_id: 'TC-302', testcase_name: 'Assembly_Dashboard_Smoke', status: 'PASS' } },
    { data: { run_id: 'RUN-1005', testcase_id: 'TC-501', testcase_name: 'Credit Card Payment', status: 'PASS' } },
    { data: { run_id: 'RUN-1005', testcase_id: 'TC-502', testcase_name: 'PayPal Checkout', status: 'PASS' } },
    { data: { run_id: 'RUN-1007', testcase_id: 'TC-701', testcase_name: 'Stock Level Sync', status: 'FAIL' } },
    { data: { run_id: 'RUN-1007', testcase_id: 'TC-702', testcase_name: 'Warehouse Transfer', status: 'PASS' } },
];

export const mockProcesses: { data: ProcessNode }[] = [
    { data: { run_id: "RUN-1001", testcase_id: "TC-101", process_id: "P-001", process_name: "Pre-Conditions", status: "PASS" } },
    { data: { run_id: "RUN-1001", testcase_id: "TC-101", process_id: "P-002", process_name: "Book Order", status: "RUNNING" } },
    { data: { run_id: "RUN-1001", testcase_id: "TC-101", process_id: "P-003", process_name: "Dashboards & BOM", status: "PENDING" } },
    { data: { run_id: "RUN-1001", testcase_id: "TC-101", process_id: "P-004", process_name: "Post Order Process", status: "PENDING" } },
    { data: { run_id: "RUN-1001", testcase_id: "TC-102", process_id: "P-005", process_name: "Customer Setup", status: "RUNNING" } },
    { data: { run_id: "RUN-1001", testcase_id: "TC-102", process_id: "P-006", process_name: "Address Validation", status: "PENDING" } },
    { data: { run_id: "RUN-1001", testcase_id: "TC-103", process_id: "P-007", process_name: "Cart Validation", status: "PENDING" } },
    { data: { run_id: "RUN-1001", testcase_id: "TC-103", process_id: "P-008", process_name: "Checkout Flow", status: "PENDING" } },
    { data: { run_id: "RUN-1001", testcase_id: "TC-104", process_id: "P-009", process_name: "Invoice Template", status: "PENDING" } },
    { data: { run_id: "RUN-1001", testcase_id: "TC-105", process_id: "P-010", process_name: "Payment Match", status: "PENDING" } },
    { data: { run_id: "RUN-1002", testcase_id: "TC-201", process_id: "P-011", process_name: "Pre-Conditions", status: "PASS" } },
    { data: { run_id: "RUN-1002", testcase_id: "TC-201", process_id: "P-012", process_name: "Book Order", status: "PASS" } },
    { data: { run_id: "RUN-1002", testcase_id: "TC-201", process_id: "P-013", process_name: "Dashboards & BOM", status: "PASS" } },
    { data: { run_id: "RUN-1002", testcase_id: "TC-201", process_id: "P-014", process_name: "Post Order Process", status: "FAIL" } },
    { data: { run_id: "RUN-1002", testcase_id: "TC-203", process_id: "P-015", process_name: "Label Generation", status: "FAIL" } },
    { data: { run_id: "RUN-1002", testcase_id: "TC-204", process_id: "P-016", process_name: "Return Auth", status: "PASS" } },
    { data: { run_id: "RUN-1003", testcase_id: "TC-301", process_id: "P-021", process_name: "Pre-Conditions", status: "PASS" } },
    { data: { run_id: "RUN-1003", testcase_id: "TC-301", process_id: "P-022", process_name: "Dashboards & BOM", status: "PASS" } },
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
    { data: { run_id: "RUN-1001", testcase_id: "TC-102", process_id: "P-005", subprocess_id: "SP-010", subprocess_name: "Profile Form Fill", status: "RUNNING" } },
    { data: { run_id: "RUN-1001", testcase_id: "TC-102", process_id: "P-005", subprocess_id: "SP-011", subprocess_name: "Email Verification", status: "PENDING" } },
    { data: { run_id: "RUN-1001", testcase_id: "TC-102", process_id: "P-006", subprocess_id: "SP-012", subprocess_name: "Zip Code Lookup", status: "PENDING" } },
    { data: { run_id: "RUN-1001", testcase_id: "TC-102", process_id: "P-006", subprocess_id: "SP-013", subprocess_name: "State Validation", status: "PENDING" } },
    { data: { run_id: "RUN-1002", testcase_id: "TC-201", process_id: "P-011", subprocess_id: "SP-101", subprocess_name: "Environment Cleanup", status: "PASS" } },
    { data: { run_id: "RUN-1002", testcase_id: "TC-201", process_id: "P-014", subprocess_id: "SP-113", subprocess_name: "Auto-Invoice Gen", status: "FAIL" } },
    { data: { run_id: "RUN-1002", testcase_id: "TC-203", process_id: "P-015", subprocess_id: "SP-114", subprocess_name: "PDF Render", status: "FAIL" } },
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
            run_id: 'RUN-1001', testcase_id: "TC-101", process_id: "P-001", subprocess_id: "SP-001",
            status: 'PASS', timestamp: '20231024100105',
            message: 'Environment Reset', Expected: 'Clean State', Actual: 'Clean State'
        }
    },
    {
        data: {
            run_id: 'RUN-1001', testcase_id: "TC-101", process_id: "P-001", subprocess_id: "SP-002",
            status: 'PASS', timestamp: '20231024100130',
            message: 'Test Data Seeded', Expected: '50 records', Actual: '50 records'
        }
    },
    {
        data: {
            run_id: 'RUN-1001', testcase_id: "TC-102", process_id: "P-005", subprocess_id: "SP-010",
            status: 'PASS', timestamp: '20231024101200',
            message: 'Profile Created', Expected: 'Customer ID exists', Actual: 'CUST-992341'
        }
    },
    {
        data: {
            run_id: 'RUN-1001', testcase_id: "TC-101", process_id: "P-002", subprocess_id: "SP-004",
            status: 'PASS', timestamp: '20231024100900',
            message: 'Order Status Check', Expected: 'CONFIRMED', Actual: 'CONFIRMED'
        }
    },
    {
        data: {
            run_id: 'RUN-1001', testcase_id: "TC-101", process_id: "P-002", subprocess_id: "SP-005",
            status: 'FAIL', timestamp: '20231024101115',
            message: 'Tax Calculation', Expected: '$124.05', Actual: '$124.00',
            Difference: '-$0.05'
        }
    },
    {
        data: {
            run_id: 'RUN-1002', testcase_id: "TC-201", process_id: "P-014", subprocess_id: "SP-113",
            status: 'FAIL', timestamp: '20231024083100',
            message: 'API Sync Error', Expected: 'status 200', Actual: 'status 500'
        }
    },
    {
        data: {
            run_id: 'RUN-1002', testcase_id: "TC-201", process_id: "P-011", subprocess_id: "SP-101",
            status: 'PASS', timestamp: '20231024082900',
            message: 'Auth Token Valid', Expected: 'token != null', Actual: 'Bearer eyJ...'
        }
    },
    {
        data: {
            run_id: 'RUN-1002', testcase_id: "TC-203", process_id: "P-015", subprocess_id: "SP-114",
            status: 'FAIL', timestamp: '20231024084500',
            message: 'Label PDF Render', Expected: 'PDF generated', Actual: 'Timeout after 30s',
            error: 'RenderTimeoutException: PDF service did not respond'
        }
    },
    {
        data: {
            run_id: 'RUN-1002', testcase_id: "TC-204", process_id: "P-016", subprocess_id: "SP-114",
            status: 'PASS', timestamp: '20231024085000',
            message: 'Return Authorization', Expected: 'RMA Created', Actual: 'RMA-445521'
        }
    },
];
