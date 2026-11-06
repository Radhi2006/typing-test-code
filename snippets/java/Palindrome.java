// @codetype easy | Check palindromes ignoring case and punctuation
public class Palindrome {
    public static boolean isPalindrome(String text) {
        String clean = text.replaceAll("[^A-Za-z0-9]", "").toLowerCase();
        int left = 0;
        int right = clean.length() - 1;
        while (left < right) {
            if (clean.charAt(left++) != clean.charAt(right--)) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome("A man, a plan, a canal: Panama"));
    }
}
