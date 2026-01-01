# Phase 2 Test Verification Script
# This script runs all Phase 2 tests and verifies stability

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Phase 2 Test Verification" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Change to project directory
Set-Location "c:\Users\chitrangi bhatnagar\SalesCentri-lightning_mode\SalesCentri-lightning_mode"

# Test 1: Single run with all browsers
Write-Host "[1/3] Running single test execution across all browsers..." -ForegroundColor Yellow
pnpm exec playwright test tests/e2e/checkout tests/e2e/auth --reporter=list

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Initial test run FAILED" -ForegroundColor Red
    Write-Host "Please check the errors above and fix them before proceeding." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Initial test run PASSED" -ForegroundColor Green
Write-Host ""

# Test 2: Measure execution time
Write-Host "[2/3] Measuring test execution time..." -ForegroundColor Yellow
$startTime = Get-Date
pnpm exec playwright test tests/e2e/checkout tests/e2e/auth --project=chromium --reporter=list | Out-Null
$endTime = Get-Date
$duration = ($endTime - $startTime).TotalMinutes

Write-Host "Test execution time: $([math]::Round($duration, 2)) minutes" -ForegroundColor Cyan

if ($duration -lt 5) {
    Write-Host "✅ Execution time is within target (< 5 minutes)" -ForegroundColor Green
} else {
    Write-Host "⚠️  Execution time exceeds target (> 5 minutes)" -ForegroundColor Yellow
}
Write-Host ""

# Test 3: Stability verification (10 consecutive runs)
Write-Host "[3/3] Running stability verification (10 consecutive runs)..." -ForegroundColor Yellow
Write-Host "This will take approximately $([math]::Round($duration * 10, 1)) minutes" -ForegroundColor Cyan
Write-Host ""

$passCount = 0
$failCount = 0

for ($i = 1; $i -le 10; $i++) {
    Write-Host "Run $i/10..." -NoNewline
    
    $result = pnpm exec playwright test tests/e2e/checkout tests/e2e/auth --project=chromium --reporter=list 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        $passCount++
        Write-Host " ✅ PASS" -ForegroundColor Green
    } else {
        $failCount++
        Write-Host " ❌ FAIL" -ForegroundColor Red
        Write-Host "Failed on run $i. Test output:" -ForegroundColor Red
        Write-Host $result
        break
    }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "VERIFICATION RESULTS" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Total Runs: 10"
Write-Host "Passed: $passCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor $(if ($failCount -eq 0) { "Green" } else { "Red" })
Write-Host "Pass Rate: $([math]::Round(($passCount / 10) * 100, 1))%"
Write-Host ""

if ($failCount -eq 0) {
    Write-Host "🎉 Phase 2 COMPLETED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "All tests passed 10 consecutive runs with 0% flakiness." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Review the HTML test report: pnpm exec playwright show-report" -ForegroundColor White
    Write-Host "2. Commit your changes: git add . && git commit -m 'Complete Phase 2 QA tests'" -ForegroundColor White
    Write-Host "3. Proceed to Phase 3: AI Feature Testing" -ForegroundColor White
} else {
    Write-Host "❌ Phase 2 INCOMPLETE" -ForegroundColor Red
    Write-Host "Tests showed flakiness with $failCount failures out of 10 runs." -ForegroundColor Red
    Write-Host "Please investigate the failed test and fix stability issues." -ForegroundColor Red
    Write-Host ""
    Write-Host "Debug Steps:" -ForegroundColor Cyan
    Write-Host "1. Run with trace: pnpm exec playwright test --trace on" -ForegroundColor White
    Write-Host "2. Run in UI mode: pnpm exec playwright test --ui" -ForegroundColor White
    Write-Host "3. Check test-results/ directory for failure details" -ForegroundColor White
}

Write-Host ""
Write-Host "Report generated: PHASE_2_COMPLETION_SUMMARY.md" -ForegroundColor Cyan
