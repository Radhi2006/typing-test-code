// @codetype medium | Count words with streams and collectors
import java.util.Arrays;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public class WordCount {
    public static Map<String, Long> count(String text) {
        return Arrays.stream(text.toLowerCase().split("\\W+"))
                .filter(word -> !word.isBlank())
                .collect(Collectors.groupingBy(Function.identity(),
                        Collectors.counting()));
    }

    public static void main(String[] args) {
        System.out.println(count("to be or not to be"));
    }
}
