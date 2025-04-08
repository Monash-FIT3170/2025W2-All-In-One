#!/home/linuxbrew/.linuxbrew/bin/expect -f

spawn meteor login

expect "Username:"
send "$env(GALAXY_USERNAME)\r"

expect "Password:"
send "$env(GALAXY_PASSWORD)\r"

expect eof