#!/bin/expect -f

spawn PATH=/home/runner/.meteor:$PATH meteor login

expect "Username:"
send "$GALAXY_USERNAME\r"

expect "Password:"
send "$GALAXY_PASSWORD\r"

expect eof