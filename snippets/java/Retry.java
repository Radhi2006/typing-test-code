// @codetype hard | Generic retry helper with exponential backoff
import java.util.concurrent.Callable;

public class Retry {
    public static <T> T withBackoff(Callable<T> task, int attempts)
            throws Exception {
        long delay = 200;
        for (int i = 1; ; i++) {
            try {
                return task.call();
            } catch (Exception e) {
                if (i >= attempts) throw e;
                System.err.printf("Attempt %d failed: %s%n", i, e.getMessage());
                Thread.sleep(delay);
                delay *= 2;
            }
        }
    }
}
