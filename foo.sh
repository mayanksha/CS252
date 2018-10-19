#!/bin/bash
git filter-branch --env-filter \
    'if [ $GIT_COMMIT = 79e4987ad9f8822af5c377cd350eea9c8d6f35a0 ]
     then
         export GIT_AUTHOR_DATE="Mon Oct 1 09:12:49 2018 +0530"
         export GIT_COMMITTER_DATE="Mon Oct 1 09:12:49 2018 +0530"
     fi'
