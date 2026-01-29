---
title: "Workshop 3"
order: 1
videoUrl: "https://youtu.be/fzseH3ROECI"
submission: |
  # Workshop 3 - Containers and Container Management Workshop Submission

  ## Instructions

  Students are required to capture and upload the following screenshots to NUS Canvas:

  ### Screenshot 1 - Docker Container Running
  Capture a screenshot showing your Docker containers running on the AWS instance.

  ![Screenshot 1](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/submission/workshop3/screen1.png)

  ### Screenshot 2 - Docker Hub Repository
  Capture a screenshot showing your Docker image pushed to Docker Hub.

  ![Screenshot 2](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/submission/workshop3/screen2.png)

  ## Submission Guidelines

  1. Take clear screenshots that show the required information
  2. Ensure your Docker Hub username and container details are visible
  3. Upload both screenshots to the designated NUS Canvas assignment folder
  4. Name your files as: `workshop3_screen1_<your_name>.png` and `workshop3_screen2_<your_name>.png`

  ## Deadline

  Please refer to NUS Canvas for the submission deadline.
---

# S-DOEA - Workshop 3 - Containers and Container Management Workshop

## Pre-requisite
* AWS Account
* Dockerhub Account
* Github Account
* Reference material - https://gitlab.com/kenken64/docker-3tier-ecs
* AWS Region: Singapore

## Test out the Docker installation on the AWS server

Provision Ubuntu server using your own AWS account

![AWS Ubuntu](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/aws-ubuntu-1.png)

Install docker engine using the below web link

https://docs.docker.com/engine/install/ubuntu/

1. Test out whether docker cli is install correctly

```bash
docker -v
```

2. Test out whether docker compose is installed correctly. If not kindly follow this installation guide (Linux , plugin method) (https://docs.docker.com/compose/install/#install-compose)

```bash
docker compose version
```

3. Create the docker group.

```bash
$ sudo groupadd docker
```

4. Add your user to the docker group. Refresh the user's profile

```bash
sudo usermod -aG docker $USER
```

Refresh the user profile by issuing the below command

```bash
source ~/.bashrc
```

5. Verify that you can run docker commands without sudo. if you run into permission denied issue when running the below command kindly logout and ssh back to the slave server.

```bash
$ docker run hello-world
```

This command downloads a test image and runs it in a container. When the container runs, it prints an informational message and exits.

If you initially ran Docker CLI commands using sudo before adding your user to the docker group, you may see the following error, which indicates that your ~/.docker/ directory was created with incorrect permissions due to the sudo commands.

```text
WARNING: Error loading config file: /home/user/.docker/config.json -
stat /home/user/.docker/config.json: permission denied
```

To fix this problem, either remove the ~/.docker/ directory (it is recreated automatically, but any custom settings are lost), or change its ownership and permissions using the following commands:

```bash
$ sudo chown "$USER":"$USER" /home/"$USER"/.docker -R
$ sudo chmod g+rwx "$HOME/.docker" -R
```

Relogin your Notebook terminal

## Dockerized a sample web app

![Docker Architecture](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/container/images/img16.png)

![Docker Flow](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/container/images/img17.png)

1. Clone source code repo from https://github.com/kenken64/reactjs-subdevice.git on the /home/ubuntu (your Slave server). Checkout to the development branch.

```bash
$ git clone https://github.com/kenken64/reactjs-subdevice.git

$ cd reactjs-subdevice

$ git checkout development
```

2. Create a Dockerfile.test under the React App (subsdevices) on the root working directory

```dockerfile
FROM node:14-alpine

WORKDIR '/app'

COPY package.json ./
RUN npm install

COPY ./ ./

CMD ["npm", "run", "start"]
```

3. Build the docker image

```bash
$ docker build -f Dockerfile.test -t kenken64/react-app .
```

4. Run the docker image as container with port forward and volume mounting, once is up and running.

```bash
$ docker run -d -p 3000:3000 -v /app/node_modules -v $(pwd):/app kenken64/react-app
```

In order to exit the container , issue the subcommand ps to look for the container id and stop it

```bash
$ docker ps

$ docker stop <container id>
```

5. Create a docker-compose.yml

```yaml
version: '3'
services:
    web:
      build:
        context: .
        dockerfile: Dockerfile.test
      ports:
        - "3000:3000"
      volumes:
        - /app/node_modules
        - .:/app
```

6. Start the docker container using docker compose.

```bash
docker compose up -d --build
```

7. Execute the following command. Implement test on separate container, please replace the placeholder value of the container id on the exec command.

```bash
$ docker ps
$ docker exec -it <web container id from docker ps> sh
# npm run test
```

In order to exit the shell out back to the host OS, type exit on the container shell

```bash
# exit
```

Add test service in the docker compose yml file, save the yml

```yaml
version: '3'
services:
    web:
      build:
        context: .
        dockerfile: Dockerfile
      ports:
        - "3000:3000"
      volumes:
        - /app/node_modules
        - .:/app
    test:
      build:
        context: .
        dockerfile: Dockerfile.test
      volumes:
          - /app/node_modules
          - .:/app
      command: ["npm", "run", "test"]
```

Stop the container by using the below command

```bash
$ docker compose stop
```

8. Let's continue building a multi step build process, different base images, create a Dockerfile file and copy paste the below to the Dockerfile

```dockerfile
# builder phase
FROM node:14-alpine as builder

WORKDIR '/app'

COPY package.json ./
RUN npm install
COPY ./ ./
RUN npm run build

FROM nginx
EXPOSE 80
COPY --from=builder /app/build /usr/share/nginx/html
```

9. Rebuild and Start the docker container using docker compose, in order to incorporate the test service.

```bash
$ docker compose up -d --build
```

Check whether the container is up and running by issueing the below command

```bash
$ docker ps
```

Once both the services is running stop the container

```bash
$ docker compose stop
```

10. Build the multi phase container setup, DO NOT terminate this process. Wait till the following show up Successfully built `<image id>`

```bash
docker build .
```

11. Start the multi phase container setup and expose the port, please replace the hash value of the container id from step 10

```bash
$ docker run -d -p 80:80 <image id>
```

In order check whether the docker is running, list the running container

```bash
$ docker ps
```

12. Launch your browser and try accessing the app http://`<aws ec2 slave server public DNS>`

13. Remember to register a docker hub account & verify your email before logging to docker hub via the CLI

```bash
$ sudo apt install gnupg2 pass
$ docker login
```

```text
Login with your Docker ID to push and pull images from Docker Hub. If you don't have a Docker ID, head over to https://hub.docker.com to create one.
Username: <your dockerhub username>
Password:
WARNING! Your password will be stored unencrypted in /home/bunnyppl/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded
```

14. Retrieve the react web docker Id from cli

```bash
$ docker images
```

15. Tag the react web image

```bash
$ docker tag <docker ps image id> <your dockerhub userid>/subsdevices:v1
```

16. Push the tagged image to the docker hub

```bash
$ docker push <your dockerhub userid>/subsdevices:v1
```

```text
The push refers to repository [docker.io/kenken64/subsdevices]
82674fe9a8e6: Pushed
6f5e00ced6e0: Pushed
86865100bc00: Pushed
7e93be41b55d: Pushed
1c07e18a989b: Mounted from library/node
b92d384cdf06: Mounted from library/node
a464c54f93a9: Mounted from library/node
v1: digest: sha256:cac661266d1cf19ae4e72f8294e332275a4761a9f5bebe1fd663b1bc3a3c1d9a size: 1788
```

17. Remember to stop all the container process after you have published the images to the registry.

```bash
$ docker ps

$ docker stop <container id>
```

## Optional workshop (Only on MacOs and Windows)

18. Create an account with snyk platform

19. How can we scan vulnerabilities for a containerized app that uses Docker?

> **Hint below**

```bash
docker scan --login --token <synk token>
```

```bash
docker scan <docker tag name>
```

![Snyk Scan](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/synk.png)
