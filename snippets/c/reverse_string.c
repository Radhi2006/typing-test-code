// @codetype easy | Reverse a string in place with two pointers
#include <stdio.h>
#include <string.h>

void reverse(char *s) {
    char *end = s + strlen(s) - 1;
    while (s < end) {
        char tmp = *s;
        *s++ = *end;
        *end-- = tmp;
    }
}

int main(void) {
    char word[] = "typing";
    reverse(word);
    printf("%s\n", word);
    return 0;
}
