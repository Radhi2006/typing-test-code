// @codetype hard | Run tasks on a thread pool and collect futures
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class ParallelTasks {
    public static void main(String[] args) throws Exception {
        ExecutorService pool = Executors.newFixedThreadPool(4);
        List<Future<Integer>> futures = new ArrayList<>();

        for (int i = 1; i <= 8; i++) {
            final int n = i;
            futures.add(pool.submit(() -> {
                Thread.sleep(100);
                return n * n;
            }));
        }

        int total = 0;
        for (Future<Integer> future : futures) {
            total += future.get();
        }
        pool.shutdown();
        System.out.println("Sum of squares: " + total);
    }
}
