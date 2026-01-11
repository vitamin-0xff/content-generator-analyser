#!/bin/bash

append_or_create() {
  local hdfs_file="$2"
  echo "file name is $hdfs_file"
  hdfs dfs -touch "/user/essid/$hdfs_file" 2> /dev/null
  hdfs dfs -appendToFile $1 2> /dev/null
}