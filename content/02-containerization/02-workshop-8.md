---
title: "Workshop 8"
order: 2
videoUrl: "https://youtu.be/CUs4R8moICY"
submission: |
  # Workshop 8 - Container Security - Docker Scout Submission

  ## Instructions

  Students are required to capture and upload the following screenshot to NUS Canvas:

  ### Screenshot 1 - Docker Scout Scan Results
  Capture a screenshot showing your Docker Scout vulnerability scan results.

  ![Screenshot 1](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/submission/workshop8/screen1.png)

  ## Submission Guidelines

  1. Take a clear screenshot that shows the Docker Scout scan output
  2. Ensure the vulnerability summary and recommendations are visible
  3. Upload the screenshot to the designated NUS Canvas assignment folder
  4. Name your file as: `workshop8_screen1_<your_name>.png`

  ## Deadline

  Please refer to NUS Canvas for the submission deadline.
---

# S-DOEA - Workshop 8 - Container Security - Docker Scout

1. Spin off a digital ocean ubuntu 24.04 (1vcpu 1GB RAM) instance with docker engine and cli installed

https://docs.docker.com/engine/install/ubuntu/

2. Setup docker scout cli on the newly created ubuntu instance (Manual installation)

```bash
mkdir ~/.docker
```

```bash
curl -sSfL https://raw.githubusercontent.com/docker/scout-cli/main/install.sh | sh -s --
```

3. Git clone down the scout vulnerable demo service server

```bash
git clone https://github.com/docker/scout-demo-service.git
```

4. Change to the demo service working directory

```bash
cd scout-demo-service
```

5. Login to the docker repository (Dockerhub), kindly use the dockerhub credential.

```bash
docker login
```

6. Build the demo server docker image, replace the placeholder with your own dockerhub username

```bash
docker build --push -t <dockerhub username>/scout-demo-<grp number>:v1 .
```

7. Scan docker image with known vulnerabilities, filter only check with a certain package

```bash
docker scout cves --only-package express
```

![Scout CVE Scan 1](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/scout1.png)

![Scout CVE Scan 2](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/scout2.png)

```bash
docker scout recommendations kenken64/scout-demo-<grp number>:v1
```

![Scout Recommendations](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/scout3.png)

8. Edit the package.json file by upgrading the express library to specific version

```bash
nano package.json
```

```json
"dependencies": {
    "express": "4.19.2"
}
```

9. Install NPM before reinstall the express library

```bash
apt install npm
```

```bash
npm i
```

10. Rebuild the docker image and push to dockerhub

```bash
docker build --push -t <dockerhub username>/scout-demo-<grp number>:v2 .
```

![Scout Build v2](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/scout4.png)

11. Re-scan for known vulnerabilities on the express library. The result of this scan will show all cves are fixed. Upload this screenshot as submission

```bash
docker scout cves --only-package express
```

![Scout CVEs Fixed](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/scout5.png)

12. Evaluate policy compliance within the containers

```bash
docker scout quickview
```

![Scout Quickview](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/scout6.png)

13. This will show you critical compliance issues, non default non root user found

14. Resolution to the above issues. Edit your Dockerfile

```bash
nano Dockerfile
```

```dockerfile
CMD ["node", "/app/app.js"]
EXPOSE 3000
USER appuser
```

15. Before building a new and push the new docker image to the repository, we need to enable container store for docker engine

```bash
nano /etc/docker/daemon.json
```

16. Paste the following content to the json file

```json
{
    "features": {
        "containerd-snapshotter": true
    }
}
```

17. Follow by a restart on the docker engine, follow by a rebuild of the image to v3

```bash
systemctl restart docker
```

```bash
docker build --provenance=true --sbom=true --push -t <dockerhub username>/scout-demo-<grp number>:v3 .
```

18. Please review your Docker Scout dashboard or the compliance quickview. Upload your final Dockerfile to the submission folder, ensuring that all previously mentioned issues have been fully resolved. Refer to the screenshots below for guidance.

```bash
docker scout quickview
```

19. Edit the Dockerfile

```dockerfile
FROM alpine:latest

ENV BLUEBIRD_WARNINGS=0 \
  NODE_ENV=production \
  NODE_NO_WARNINGS=1 \
  NPM_CONFIG_LOGLEVEL=warn \
  SUPPRESS_NO_CONFIG_WARNING=true

RUN apk add --no-cache \
  nodejs
RUN apk update && apk upgrade
COPY package.json ./

RUN  apk add --no-cache npm \
 && npm i --no-optional \
 && npm cache clean --force \
 && apk del npm

COPY . /app

CMD ["node","/app/app.js"]

EXPOSE 3000
USER appuser
```

20. Run the following to fix the remaining vulnerability

```bash
npm audit fix --force
```

21. Publish the final docker image to the hub. Make sure there isn't any remaining vulnerability

```bash
docker build --provenance=true --sbom=true --push -t <dockerhub username>/scout-demo-<grp number>:v4 .
```

![Scout Final Build](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/scout7.png)

22. Enable the scout scanning, navigate the repository settings

![Scout Settings 1](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/scout14.png)

![Scout Settings 2](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/scout8.png)

![Scout Settings 3](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/scout9.png)

![Scout Settings 4](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/scout10.png)

![Scout Settings 5](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/scout11.png)

![Scout Settings 6](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/scout12.png)

![Scout Settings 7](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/scout13.png)
