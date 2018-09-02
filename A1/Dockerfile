FROM ubuntu:16.04

# Create app directory

RUN useradd -ms /bin/bash bajrang 

RUN mkdir /home/bajrang/server
RUN apt-get update 
RUN apt-get install -y build-essential git python
RUN cd /home/bajrang/server
RUN git clone https://github.com/mayanksha/CS252 /home/bajrang/server
CMD ["cd", "CS252"]

CMD ["cd", "/home/bajrang/server/A1"]
CMD ["gcc", "server.c"]
CMD ["bash", "./a.out"]
EXPOSE 8000
