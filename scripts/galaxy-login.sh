#!/usr/bin/expect -f

if {$argc != 2} {
  puts "The script takes exactly two arguments, username and password in sequence."
  exit
}
set username [lindex $argv 0]
set password [lindex $argv 1]

# =============== SCRIPT ================
spawn meteor login

expect "Username:"
send "$username\r"

expect "Password:"
send "$password\r"

expect eof