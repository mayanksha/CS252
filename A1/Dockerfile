FROM ubuntu:16.04

# Create app directory

RUN useradd -ms /bin/bash bajrang 

RUN mkdir /home/bajrang/server
RUN sudo apt-get  install -y build-essential git python
cd /home/bajrang/server
RUN git clone https://github.com/mayanksha/CS252
RUN cd CS252
RUN gcc server.c && ./a.out 

EXPOSE 8000
