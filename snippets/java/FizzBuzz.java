// @codetype easy | The classic FizzBuzz with a StringBuilder
public class FizzBuzz {
    public static void main(String[] args) {
        StringBuilder out = new StringBuilder();
        for (int i = 1; i <= 30; i++) {
            if (i % 15 == 0) out.append("FizzBuzz");
            else if (i % 3 == 0) out.append("Fizz");
            else if (i % 5 == 0) out.append("Buzz");
            else out.append(i);
            out.append('\n');
        }
        System.out.print(out);
    }
}
