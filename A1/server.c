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

unsigned long long getFileSize(FILE* fptr){
	unsigned long long fsize;
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
	return fsize;
}

char* handleHTTPReq(int fd){
	/*int maxBufferSize = 65536;
	 *char request[maxBufferSize];*/
	int request_buffer_size = 65536; // 64K
	char* req_300;
	req_300 = (char*)malloc(300*sizeof(char));
	memset(req_300, '\0', 300);
	char *request;
	request = (char*)malloc(request_buffer_size*sizeof(char));
	memset(request, '\0', request_buffer_size);
	char *p;
	char request_type[8]; // GET or POST
	char request_path[1024]; // /info etc.
	char request_protocol[128]; // HTTP/1.1

	// Read request
	int bytes_recvd = recv(fd, request, request_buffer_size - 1, 0);

	strncpy(req_300, request, 299);
	char *query = parse_query(req_300);
	data* values = parse(query);
	char* send_data = (char*)malloc(100*sizeof(char));
	sprintf(send_data, "cars:%d, dogs:%d, cats:%d, trucks:%d", values->cars, values->dogs, values->cats, values->trucks);
	// printf("%s\n", send_data);
	// printf("\n");

	return send_data;
}

void query_response(int fd, char* send_data)
{
	char headerBuffer[10000], data2[200], fileBuffer[100000];
	strcpy (headerBuffer, "HTTP/1.1 200 OK\r\nContent-Length: ");
    /* content-length: */
    sprintf(data2, "%ld", sizeof(send_data));
    strcat (headerBuffer, data2);
    strcat (headerBuffer, "\r\n");
    /* content-type: */
    // printf ("Content-Type: %s\n", data2);
    strcat (headerBuffer, "application/json");
    headerBuffer[strlen(headerBuffer)] = '\0';

	strcat(headerBuffer, "Connection: Keep-alive\r\n\r\n");
	write(fd, send_data, sizeof(send_data));
	return ;
}

void image_response(int newSocket, char* send_data)
{
	char image[100] = "image/";
	strcat(image, send_data);
	FILE * fptr;
	fptr = fopen(image, "r");

	unsigned long long fsize = getFileSize(fptr);

	char headerBuffer[10000], data2[200], fileBuffer[100000];
	strcpy (headerBuffer, "HTTP/1.1 200 OK\r\nContent-Length: ");
    /* content-length: */
    sprintf(data2, "%lld", fsize);
    strcat (headerBuffer, data2);
    strcat (headerBuffer, "\r\n");
    /* content-type: */
    // printf ("Content-Type: %s\n", data2);
    strcat (headerBuffer, "image/jpg");
    headerBuffer[strlen(headerBuffer)] = '\0';

	strcat(headerBuffer, "Connection: Keep-alive\r\n\r\n");
	write (newSocket, headerBuffer, strlen(headerBuffer));
	fread (fileBuffer, sizeof(char), fsize+1, fptr);
	fclose(fptr);
	printf("vaibhav\n");
	write (newSocket, fileBuffer, fsize);
}

int main(){
	int welcomeSocket, newSocket;
	struct sockaddr_in serverAddr;
	struct sockaddr_storage serverStorage;
	socklen_t addr_size;

	/*---- Create the socket. The three arguments are: ----*/
	/* 1) Internet domain 2) Stream socket 3) Default protocol (TCP in this case) */
	welcomeSocket = socket(PF_INET, SOCK_STREAM, 0);

	if (welcomeSocket < 0) {
		perror("Error opening socket!\n");
	}

	/*---- Configure settings of the server address struct ----*/
	/* Address family = Internet */
	serverAddr.sin_family = AF_INET;
	/* Set port number, using htons function to use proper byte order */
	serverAddr.sin_port = htons(8002);
	/* Set IP address to localhost */
	serverAddr.sin_addr.s_addr = inet_addr("127.0.0.1");
	/* Set all bits of the padding field to 0 */
	memset(serverAddr.sin_zero, '\0', sizeof serverAddr.sin_zero);

	/*---- Bind the address struct to the socket ----*/

	bind(welcomeSocket, (struct sockaddr *) &serverAddr, sizeof(serverAddr));

	/*---- Listen on the socket, with 5 max connection requests queued ----*/
	int c = 0;
	if(listen(welcomeSocket,5)==0)
			printf("I'm listening Count c = %d\n", c++);
	else
			printf("Error\n");

	addr_size = sizeof(serverStorage);
	// printf("Size of image = %lld", fsize);
	while(1)
	{
		newSocket = accept(welcomeSocket, (struct sockaddr *) &serverStorage, &addr_size);

		printf("connected...\n");

		char* send_data = handleHTTPReq(newSocket);
		printf("%d\n", FLAG);

		if(FLAG == 0)
		{
			printf("%s\n", send_data);
			query_response(newSocket, send_data);
		}
		else
		{
			image_response(newSocket, send_data);
		}
		
		close(newSocket);
		FLAG = 0;
	}

	printf("hoza\n");
	close(welcomeSocket);

	return 0;
}