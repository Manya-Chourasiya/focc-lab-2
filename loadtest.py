import urllib.request
import concurrent.futures
import time

# Replace with your frontend service external IP if different, or use cluster IP/port-forward
TARGET_URL = "http://20.24.253.124/work?ms=50"
NUM_WORKERS = 30
DURATION_SECONDS = 180

def send_request():
    try:
        start_time = time.time()
        req = urllib.request.urlopen(TARGET_URL, timeout=10)
        status = req.getcode()
        duration = time.time() - start_time
        return (status, duration)
    except Exception as e:
        return (None, str(e))

print(f"Starting load test against {TARGET_URL} with {NUM_WORKERS} workers for {DURATION_SECONDS} seconds...")

end_time = time.time() + DURATION_SECONDS
success_count = 0
timeout_count = 0
latencies = []

with concurrent.futures.ThreadPoolExecutor(max_workers=NUM_WORKERS) as executor:
    while time.time() < end_time:
        futures = [executor.submit(send_request) for _ in range(NUM_WORKERS)]
        for future in concurrent.futures.as_completed(futures):
            status, duration = future.result()
            if status == 200:
                success_count += 1
                latencies.append(duration)
            else:
                timeout_count += 1
        time.sleep(0.5)

print("\n--- Load Test Results Summary ---")
print(f"Success (200): {success_count}")
print(f"Timeouts/Errors: {timeout_count}")
if latencies:
    latencies.sort()
    avg_lat = sum(latencies) / len(latencies)
    p95_lat = latencies[int(len(latencies) * 0.95)]
    print(f"Average Latency: {avg_lat*1000:.2f} ms")
    print(f"P95 Latency: {p95_lat*1000:.2f} ms")
