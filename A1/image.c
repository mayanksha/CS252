#include <stdio.h>
#include <string.h>
#include <stdlib.h>


typedef struct data{
    int cars;
    int dogs;
    int trucks;
}data;


void parse(char *s){
    char* p1 = strstr(s,"?string=");
    if(p1){
        p1+=8;
        char* p2 = strstr(s," HTTP");
        char result[200];
        int i=0;
        while(p1!=p2){
            result[i] = *p1;
            p1++;
            i++;
        }
        result[i]='\0';
        printf("%s\n",result );
    }
    else{
        p1 = strstr(s,"GET /");
        p1+=5;
        char* p2 =  strstr(s," HTTP");
        char result[200];
        int i=0;
        while(p1!=p2){
            result[i] = *p1;
            p1++;
            i++;
        }
        result[i]='\0';
        printf("%s\n",result );
    }


    //printf("%s",result);
}


int main(){
    char a[300] = "GET /cadhvhgd1.jpg HTTP/1.1 Host: 127.0.0.1:8000 User-Agent: curl/7.61.0 Accept: /";
    parse(a);
    return 0;
}
