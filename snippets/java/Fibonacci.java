// @codetype easy | Iterative Fibonacci with long arithmetic
public class Fibonacci {
    public static long fib(int n) {
        long previous = 0;
        long current = 1;
        for (int i = 0; i < n; i++) {
            long next = previous + current;
            previous = current;
            current = next;
        }
        return previous;
    }

    public static void main(String[] args) {
        System.out.println(fib(50));
    }
}
