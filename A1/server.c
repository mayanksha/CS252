/* credit @Daniel Scocco */

/****************** SERVER CODE ****************/

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <netinet/in.h>
#include <string.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include "parser.h"
#include "image.h"

#define  REQ_BUFFER_MAX_SIZE 65536
#define  HOST_SIZE 22 
struct requestHeaders {
	char request[REQ_BUFFER_MAX_SIZE];
	char host[];
};

unsigned long long getFileSize(char * image){
	unsigned long long fsize;
	FILE* fptr = fopen(image, "r");
	if (fptr == NULL){
		printf("File not found!\n");
		return 1;
	}
	else {
		fseek(fptr, 0, SEEK_END);
		fsize = ftell(fptr);
		rewind(fptr);
		printf("File contains %lld bytes!\n", fsize);
	}
	fclose(fptr);
	return fsize;
}

char* handleHTTPReq(int fd, int flag){
	/*int maxBufferSize = 65536;
	 *char request[maxBufferSize];*/
	int request_buffer_size = 65536; // 64K
	char * req_300 = (char*)malloc(10000*sizeof(char));
	memset(req_300, '\0', 10000);
	char * request = (char*)malloc(request_buffer_size*sizeof(char));
	memset(request, '\0', request_buffer_size);

	/*char request_type[8]; // GET or POST
	 *char request_path[1024]; // /info etc.*/
	/*char request_protocol[128]; // HTTP/1.1*/

	// Read request
	int bytes_recvd = recv(fd, request, request_buffer_size - 1, 0);
	printf("%s\n\n", request);
	strncpy(req_300, request, 299);
	data* values;

    char* p1 = strstr(request,"?string=");
	char* query = parse_query(req_300);
	char* send_data = (char*)malloc(1000*sizeof(char));

	if (p1){
		sprintf(send_data, "{cars:%d, dogs:%d, cats:%d, trucks:%d}", values->cars, values->dogs, values->cats, values->trucks);
	}
	else {
		strcat(send_data, query);
	}
	send_data[strlen(send_data)] = '\0';
	printf("Values = %s\n", send_data);
	// printf("\n");

	return send_data;
}

void query_response(int fd, char* send_data){
	char headerBuffer[10000], data2[200], fileBuffer[100000];

	strcpy (headerBuffer, "HTTP/1.1 200 OK\r\n");
	strcat(headerBuffer, "Connection: Keep-alive\r\n");
	strcat(headerBuffer, "Content-Type: application/json\r\n\r\n");

	/*strcat(headerBuffer, "Content-Length: ");
	 *sprintf(data2, "%lld", fsize);*/

	strcat (headerBuffer, send_data);
	headerBuffer[strlen(headerBuffer)] = '\0';

	write(fd, headerBuffer, strlen(headerBuffer));
	return ;
}

void image_response(char* imageName, int newSocket, char* send_data) {
	char image[100] = "images/";
	strcat(image, imageName);
	unsigned long long fsize = getFileSize(image);

	FILE * fptr = fopen(image, "r");
	printf("File size = %lld\n", fsize);
	char headerBuffer[10000], data2[200], fileBuffer[100000];
	memset(fileBuffer, '\0', 100000);
	strcpy (headerBuffer, "HTTP/1.1 200 OK\r\n");
	strcat(headerBuffer, "Connection: Keep-alive\r\n");
	/* content-length: */
	strcat(headerBuffer, "Content-Length: ");
	sprintf(data2, "%lld", fsize);
	strcat (headerBuffer, data2);
	strcat (headerBuffer, "\r\n");
	strcat(headerBuffer, "Content-Type: ");
	strcat (headerBuffer, "image/jpg\r\n\r\n");
	/* content-type: */

	headerBuffer[strlen(headerBuffer)] = '\0';
	write (newSocket, headerBuffer, strlen(headerBuffer));
	fread (fileBuffer, sizeof(char), fsize+1, fptr);
	fclose(fptr);
	write (newSocket, fileBuffer, fsize);
	return;
}

int main(){
	int welcomeSocket, opt = 1;
	struct sockaddr_in serverAddr;
	struct sockaddr_storage serverStorage;
	socklen_t addr_size;

	/*---- Create the socket. The three arguments are: ----*/
	/* 1) Internet domain 2) Stream socket 3) Default protocol (TCP in this case) */
	welcomeSocket = socket(AF_INET, SOCK_STREAM, 0);
	if (welcomeSocket == 0) {
		perror("Error Opening Socket!\n");
		exit(EXIT_FAILURE);
	}
	if (setsockopt(welcomeSocket, SOL_SOCKET, SO_REUSEADDR | SO_REUSEPORT, &opt, sizeof(opt))){
		perror("Setsockopt Error!");
		exit(EXIT_FAILURE);
	}

	/*---- Configure settings of the server address struct ----*/
	/* Address family = Internet */
	serverAddr.sin_family = AF_INET;
	/* Set port number, using htons function to use proper byte order */
	serverAddr.sin_port = htons(8000);
	/* Set IP address to localhost */
	serverAddr.sin_addr.s_addr = inet_addr("127.0.0.1");
	/* Set all bits of the padding field to 0 */
	memset(serverAddr.sin_zero, '\0', sizeof serverAddr.sin_zero);

	/*---- Bind the address struct to the socket ----*/

	if(bind(welcomeSocket, (struct sockaddr *) &serverAddr, sizeof(serverAddr))){
		perror("Bind Failed");
        exit(EXIT_FAILURE);
	};

	/*---- Listen on the socket, with 5 max connection requests queued ----*/
	int c = 0;
	if(listen(welcomeSocket,100) == 0)
		printf("I'm listening Count c = %d\n", c++);
	else
		printf("Error\n");

	addr_size = sizeof(serverStorage);
	// printf("Size of image = %lld", fsize);
	while(1)
	{
		c++;
		int newSocket = accept(welcomeSocket, (struct sockaddr *) &serverStorage, &addr_size);
		printf("connected...\n");
		char* send_data = handleHTTPReq(newSocket, FLAG);
		if(!FLAG){
			printf("%s\n", send_data);
			query_response(newSocket, send_data);
		}
		else {
			image_response(send_data, newSocket, send_data);
		}

		close(newSocket);
		FLAG = 0;
	}

	close(welcomeSocket);
	return 0;
}
