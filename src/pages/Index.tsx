const tests = [
  { name: "Login with valid credentials", status: "pass", duration: "1.2s" },
  { name: "Login with invalid password", status: "pass", duration: "0.8s" },
  { name: "Registration form validation", status: "fail", duration: "2.1s" },
  { name: "Password reset email sent", status: "pass", duration: "1.5s" },
  { name: "Dashboard loads correctly", status: "pass", duration: "0.9s" },
  { name: "Profile update saves data", status: "fail", duration: "3.2s" },
  { name: "Logout clears session", status: "pass", duration: "0.4s" },
  { name: "API returns 404 for missing route", status: "pass", duration: "0.3s" },
  { name: "File upload size limit", status: "skip", duration: "—" },
  { name: "Search returns correct results", status: "pass", duration: "1.1s" },
];

const passed = tests.filter((t) => t.status === "pass").length;
const failed = tests.filter((t) => t.status === "fail").length;
const skipped = tests.filter((t) => t.status === "skip").length;
const passRate = Math.round((passed / tests.length) * 100);

const statusColor: Record<string, string> = {
  pass: "bg-green-600 text-white",
  fail: "bg-red-600 text-white",
  skip: "bg-yellow-500 text-white",
};

const Index = () => (
  <div className="min-h-screen bg-background p-8 max-w-3xl mx-auto">
    <h1 className="text-2xl font-bold text-foreground mb-6">Test Execution Report</h1>

    <div className="flex gap-4 mb-6 flex-wrap">
      <span className="px-3 py-1 rounded bg-muted text-foreground font-medium">Total: {tests.length}</span>
      <span className="px-3 py-1 rounded bg-green-600 text-white font-medium">Passed: {passed}</span>
      <span className="px-3 py-1 rounded bg-red-600 text-white font-medium">Failed: {failed}</span>
      <span className="px-3 py-1 rounded bg-yellow-500 text-white font-medium">Skipped: {skipped}</span>
    </div>

    <div className="w-full h-4 rounded-full bg-muted overflow-hidden mb-8 flex">
      <div className="h-full bg-green-600" style={{ width: `${passRate}%` }} />
      <div className="h-full bg-red-600" style={{ width: `${Math.round((failed / tests.length) * 100)}%` }} />
      <div className="h-full bg-yellow-500" style={{ width: `${Math.round((skipped / tests.length) * 100)}%` }} />
    </div>

    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="border-b border-border text-left text-muted-foreground">
          <th className="py-2 pr-4">#</th>
          <th className="py-2 pr-4">Test Name</th>
          <th className="py-2 pr-4">Status</th>
          <th className="py-2">Duration</th>
        </tr>
      </thead>
      <tbody>
        {tests.map((t, i) => (
          <tr key={i} className="border-b border-border">
            <td className="py-2 pr-4 text-muted-foreground">{i + 1}</td>
            <td className="py-2 pr-4 text-foreground">{t.name}</td>
            <td className="py-2 pr-4">
              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${statusColor[t.status]}`}>
                {t.status.toUpperCase()}
              </span>
            </td>
            <td className="py-2 text-muted-foreground">{t.duration}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Index;
