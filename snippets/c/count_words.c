// @codetype easy | Count words separated by whitespace
#include <ctype.h>
#include <stdio.h>

int count_words(const char *text) {
    int count = 0;
    int in_word = 0;
    for (; *text != '\0'; text++) {
        if (isspace((unsigned char)*text)) {
            in_word = 0;
        } else if (!in_word) {
            in_word = 1;
            count++;
        }
    }
    return count;
}
