#include <stdio.h>
#include <string.h>
#include <stdlib.h>

int FLAG = 0;

char* parse_query(char *s){
    char* p1 = strstr(s,"?string=");

    char* result;
    result = (char*)malloc(200*sizeof(char));
	/*strcat(result, "{\r\n");*/
    if(p1){
        p1+=8;
        char* p2 = strstr(s," HTTP");
        int i=0;
        while(p1!=p2){
            result[i] = *p1;
            p1++;
            i++;
        }
        result[i]='\0';
    }
    else{
        FLAG = 1;
        p1 = strstr(s,"GET /");
        p1+=5;
        char* p2 =  strstr(s," HTTP");
        int i=0;
        while(p1!=p2){
            result[i] = *p1;
            p1++;
            i++;
        }
        result[i]='\0';
    }

	/*strcat(result, "\r\n}\r\n");*/
    return result;
}


// int main(){
//     char a[300] = "GET /cadhvhgd1.jpg HTTP/1.1 Host: 127.0.0.1:8000 User-Agent: curl/7.61.0 Accept: /";
//     parse(a);
//     return 0;
// }
