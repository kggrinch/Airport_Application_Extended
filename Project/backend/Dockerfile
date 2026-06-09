# Dockerfile works in layers. 
# Example: 
# Layer 1: node:20              # Base image to start the build process. It includes the operating system and Node.js environment. 
# Layer 2: /app directory       # Set the working directory inside the container (backend directory here for backend dockerfile)
# Layer 3: package.json copied  # Takes files (dependencies template (package.json file)) from your computer (host machine). Copies them into the image filesystem
# Layer 4: npm install          # Installs the dependencies defined in package.json. 
# Layer 5: source code copied   # Takes the source code from your computer and copies it into the image filesystem. This layer includes all the application code that will be executed when the container runs.
# Layer 6: Documentation (CMD)  # Specifies the command to run when the container starts. This is the entry point for the application, telling Docker how to start the application when the container is launched.
# Layer 6: Running when the container starts. # When you run the container, Docker will execute the command specified in the CMD instruction. This command typically starts the application or service that the container is designed to run.

# Environment variables (ENV) are used to set environment variables in the Docker image. 

# use the official Node.js image as the base image. Includes Linux(Debian)+ Node.js (npm/npx/node) + npm + system defaults (http/https)
FROM node:20 

# set the working directory inside the container to /backend. All subsequent commands will be executed in this directory.
WORKDIR /backend

# copy the package.json and package-lock.json files from the host machine to the current working directory in the container. These files contain teamplate (metadata) about the project and its dependencies.
COPY package*.json ./ 

# run the npm install command to install the dependencies defined in package.json. This will create a node_modules directory with all the required packages.
RUN npm install 

# copy the rest of the application source code from the host machine to the current working directory in the container. This includes all the application files needed to run the application.
COPY . .

# Environment variables set up after from
ENV PORT=3000

# expose port 3000 to allow external access to the application running inside the container.
EXPOSE 3000 

# specify the command to run when the container starts. In this case, it runs npm start, which typically starts the application defined in the package.json file.
CMD ["npm", "start"]

