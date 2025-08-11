#!/home/linuxbrew/.linuxbrew/bin/expect -f

# Enable logging to console and file
log_user 1
log_file login.log

# Increase timeout to 30 seconds
set timeout 300

if {$argc != 2} {
  puts "The script takes exactly two arguments, username and password in sequence."
  exit
}
set username [lindex $argv 0]
set password [lindex $argv 1]

# =============== SCRIPT ================
spawn meteor login


expect {
  -re "Username:" {}
  timeout {
    puts "Timeout waiting for Username prompt"
    exit 1
  }
}

send "$username\r"

expect {
  -re "Password:" {}
  timeout {
    puts "Timeout waiting for Password prompt"
    exit 1
  }
}

send "$password\r"