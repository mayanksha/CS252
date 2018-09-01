/* credit @Daniel Scocco */

/****************** SERVER CODE ****************/

#include <stdio.h>
#include <stdlib.h>
#include <netinet/in.h>
#include <string.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>

#define  REQ_BUFFER_MAX_SIZE 65536
	// 3*4 (IP Address) + 1 * 3 (. dots) + 1 (: colon) + 5 (Port number) + 1 (Null character)
#define  HOST_SIZE 22 
struct requestHeaders {
	char request[REQ_BUFFER_MAX_SIZE];
	char host[];
};
void handleHTTPReq(int fd){
	/*int maxBufferSize = 65536;
	 *char request[maxBufferSize];*/
	int request_buffer_size = 65536; // 64K
	char request[request_buffer_size];
	char *p;
	char request_type[8]; // GET or POST
	char request_path[1024]; // /info etc.
	char request_protocol[128]; // HTTP/1.1

	// Read request
	int bytes_recvd = recv(fd, request, request_buffer_size - 1, 0);

	for(int i = 0;i < request_buffer_size; i++){
		printf("%c", request[i]); 
	}
	printf("\n"); 
	if (bytes_recvd < 0) {
		perror("recv");
		return;
	}

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
	serverAddr.sin_port = htons(8000);
	/* Set IP address to localhost */
	serverAddr.sin_addr.s_addr = inet_addr("127.0.0.1");
	/* Set all bits of the padding field to 0 */
	memset(serverAddr.sin_zero, '\0', sizeof serverAddr.sin_zero);

	/*---- Bind the address struct to the socket ----*/

	/*---- Listen on the socket, with 5 max connection requests queued ----*/
	int c = 0;
	char htmlFile[100] = "foo.html";

	FILE * fptr;
	/*fptr = fopen(htmlFile, "r");*/
	unsigned long long fsize;
	/*    if (fptr == NULL){
	 *        printf("File not found!\n");
	 *        return 1;
	 *    }
	 *    else {
	 *        printf("Found file %s\n", htmlFile);
	 *
	 *        fseek(fptr, 0, SEEK_END);
	 *        fsize = ftell(fptr);
	 *        rewind(fptr);
	 e
	 *        printf("File contains %lld bytes!\n", fsize);
	 *    }*/

	/*    char* fileBuffer=(char*) malloc(sizeof(char)* fsize);
	 *    size_t readBytes = fread(fileBuffer, sizeof(char), fsize, fptr);
	 *    printf("Bytes read = %d\n", fsize);
	 *    fprintf(stdout, fileBuffer);
	 **/

	while(1){

	bind(welcomeSocket, (struct sockaddr *) &serverAddr, sizeof(serverAddr));

	if(listen(welcomeSocket,5)==0)
		printf("I'm listening Count c = %d\n", c++);
	else
		printf("Error\n");

	addr_size = sizeof serverStorage;
	newSocket = accept(welcomeSocket, (struct sockaddr *) &serverStorage, &addr_size);

	handleHTTPReq(newSocket);
	char a[100] = "Hello World!";
	send(newSocket, a, 100, 0);
	/*write(newSocket, a, 100);*/
	/*    while(fsize > 0){
	 *        int bytes_written = write(newSocket, fileBuffer, fsize);
	 *        if (bytes_written <= 0) {
	 *            perror("ERROR writing to socket\n");
	 *        }
	 *
	 *        fsize -= bytes_written;
	 *        printf("Bytes written = %d, remaining = %d\n", bytes_written, fsize);
	 *    }*/
	close(newSocket);
	}

	return 0;
}


