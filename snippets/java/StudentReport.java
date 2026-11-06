// @codetype medium | Records and streams to rank students
import java.util.Comparator;
import java.util.List;

public class StudentReport {
    record Student(String name, double gpa) {}

    public static void main(String[] args) {
        List<Student> students = List.of(
                new Student("Ayu", 3.8),
                new Student("Bima", 3.2),
                new Student("Citra", 3.9));

        students.stream()
                .filter(s -> s.gpa() >= 3.5)
                .sorted(Comparator.comparingDouble(Student::gpa).reversed())
                .map(s -> s.name() + " (" + s.gpa() + ")")
                .forEach(System.out::println);
    }
}
