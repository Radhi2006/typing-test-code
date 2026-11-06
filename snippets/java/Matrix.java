// @codetype medium | Multiply two matrices with nested loops
public class Matrix {
    public static int[][] multiply(int[][] a, int[][] b) {
        int rows = a.length;
        int cols = b[0].length;
        int inner = b.length;
        int[][] result = new int[rows][cols];
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                for (int k = 0; k < inner; k++) {
                    result[i][j] += a[i][k] * b[k][j];
                }
            }
        }
        return result;
    }
}
