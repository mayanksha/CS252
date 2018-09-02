#include <stdio.h>
#include <string.h>
#include <stdlib.h>
//#include "parser.h"

typedef struct data{
    int cars;
    int dogs;
    int trucks;
    int cats;
}data;

data* parse(char *s){
    data* value = (data *)malloc(sizeof(data));
    int i=0;
    char* p1 = strstr(s,"+car");
    char* p2 = strstr(s,"+dog");
    char* p3 = strstr(s,"+truck");
    char* p4 = strstr(s,"+cat");
    if(p1){
        value->cars = (int)(*(p1-1)-'0');
    }
    else{
        value->cars=0;
    }
    if(p2){
        value->dogs = (int)(*(p2-1)-'0');
    }
    else{
        value->dogs=0;
    }
    if(p3){
        value->trucks = (int)(*(p3-1)-'0');
    }
    else{
        value->trucks=0;
    }
    if(p4){
        value->cats = (int)(*(p4-1)-'0');
    }
    else{
        value->cats=0;
    }
}


// int main(){
//     char a[50] = "4 cs 3 dogs and 4 trucks";
//     data* valu = parse(a);
//     printf("%d %d %d",valu->cars,valu->dogs,valu->trucks);
//     return 0;
// }
