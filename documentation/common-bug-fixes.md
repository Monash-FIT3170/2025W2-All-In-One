When you are having issues after merging with main, it is possible it is from the JSON-Package file. Delete the node_modules folder, also delete the package-json file.
Then run npm install in terminal.

After meteor run, localhost is blank and not loaded. The terminal is not necessarily showing any errors either.
This is could be due to not all libraries are installed correctly
First approach is:
npm install 
meteor reset
meteor run 
If above didn't work then you could consider below 
rm -rf node_modules .meteor/local package-lock.json 
npm cache clean --force 
meteor reset 
npm install
meteor run

