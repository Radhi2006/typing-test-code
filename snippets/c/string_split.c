// @codetype medium | Split a CSV line into fields with strtok
#include <stdio.h>
#include <string.h>

int main(void) {
    char line[] = "id,name,email,role";
    const char *fields[8];
    int count = 0;

    for (char *tok = strtok(line, ","); tok && count < 8; tok = strtok(NULL, ",")) {
        fields[count++] = tok;
    }
    for (int i = 0; i < count; i++) {
        printf("[%d] %s\n", i, fields[i]);
    }
    return 0;
}
