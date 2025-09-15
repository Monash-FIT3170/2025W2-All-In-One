## CI/CD

Our project incorporates continuous integration and continuous delivery principles where we integrate small changes into our production version of the app deployed on Azure every time they are made. We incorporate two pipelines, one to fulfill deployment, with the other ensuring the code that we deploy isn't broken and regressed compared to previous iterations.

In summary we have the two pipelines:
Build and test:
Triggered when: A pull request is created or updated
Purpose: Build the application using meteor to ensure the code isn’t broken and run all unit tests

Deploy:
Triggered when: A pull request is merged into main
Purpose: Build, test then deploy the application to our shared Azure account allowing the app to be accessed via the link
https://allinone-web.azurewebsites.net/
