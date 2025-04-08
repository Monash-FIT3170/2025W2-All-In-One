#!/home/linuxbrew/.linuxbrew/bin/expect -f

spawn meteor login

expect "Username:"
send "$GALAXY_USERNAME\r"

expect "Password:"
send "$GALAXY_PASSWORD\r"

expect eof