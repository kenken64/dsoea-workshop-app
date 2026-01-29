---
title: "Workshop 2"
order: 2
videoUrl: "https://youtu.be/lqh3ORhwXN0"
submission: |
  # Workshop 2 - Jenkins Installation Submission

  ## Instructions

  Students are required to capture and upload the following screenshots to NUS Canvas:

  ### Screenshot 1 - Jenkins Dashboard
  Capture a screenshot showing your Jenkins dashboard with the URL visible in the address bar.

  ![Screenshot 1](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/submission/workshop2/screen1.png)

  ### Screenshot 2 - EC2 Instance
  Capture a screenshot showing your AWS EC2 instance running with Jenkins.

  ![Screenshot 2](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/submission/workshop2/screen2.png)

  ## Submission Guidelines

  1. Take clear screenshots that show the required information
  2. Ensure the Jenkins URL and your AWS instance details are visible
  3. Upload both screenshots to the designated NUS Canvas assignment folder
  4. Name your files as: `workshop2_screen1_<your_name>.png` and `workshop2_screen2_<your_name>.png`

  ## Deadline

  Please refer to NUS Canvas for the submission deadline.
---

# S-DOEA - Workshop 2 - Jenkins Installation

## Pre-requisites for Cloud installation
* AWS NUS ISS account
* AWS Region: Singapore

### Step by step installation

1. Navigate to the AWS services link top left corner beside the AWS logo

![AWS Services](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/jenkins24.png)

2. Search/Select EC2 under the compute category

3. Launch a new instance, search 'bitnami jenkins' on the marketplace

![EC2](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/aws_ec2.png)

4. Search 'bitnami jenkins' on AWS marketplace click on Select to create the instance

![Bitnami Jenkins 1](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/aws_ec2_2-1.png)

![Bitnami Jenkins 2](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/aws_ec2_2.png)

5. On the next page a pricing details page will be shown. Click continue

![Pricing](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/jenkins3.png)

6. Choose an instance type which is t2 micro/small (free tier). Click Next Configure Instance details

![Instance Type](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/jenkins4.png)

7. Landed on a configure instance details page and by default nothing is require to be configure on this page. Click Add Storage

![Configure Instance](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/jenkins5.png)

8. On the configure storage page change 10GB to 15GB. Try not add more mount point overall AWS only give 30GB per instance on free tier.

![Storage](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/jenkins6.png)

9. Define a tag for your jenkins server click add tag on the key field specify 'name' and value as 'project_name_ubuntu_jenkins'. Click Next

![Tags](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/jenkins7.png)

10. Configure security group as default no addition configuration is needed on this page

![Security Group](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/jenkins8.png)

11. Upon launching the instance AWS require us to create a new pair of private key to be use to access the instance.

![Key Pair](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/jenkins11.png)

12. Review all the configuration and click on Launch

13. After creating the private key, a new instance will be launch. Kindly wait for a few minutes. Upon successful creation of the instance your instance is now ready to be use

![Instance Launch](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/jenkins12.png)

14. Click on the instance id, the look out for instance status where it is running.

![Instance Status](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/jenkins13.png)

15. Use Git Bash on your local environment to log into the newly created server. Ensure to replace the placeholder with the corresponding values enclosed in <>

```bash
$ ls -lrt <location of your pem filename>
$ chmod 400 <location of your pem filename>
$ ssh -i <location of your pem filename> bitnami@<AWS jenkins server Public IP>
```

16. Upon logging into the EC2 instance, change directory to /home/bitnami

```bash
$ cd /home/bitnami
```

17. Look for the username and password under the bitnami_credentials file. View the bitnami_credentials file with the following command

```bash
more bitnami_credentials
```

As result the more command will show the default username and password on your terminal screen

```text
Welcome to the Bitnami Jenkins Stack

******************************************************************************
The default username and password is 'user' and 'Dh9b6mi4AQOF'.
******************************************************************************

You can also use this password to access the databases and any other component the stack includes.

Please refer to https://docs.bitnami.com/ for more details.
```

18. Retrieve ip4 public IP address or the DNS name from the AWS jenkins instance console panel

![Public IP](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/jenkins14.png)

19. Launch the web browser then access the jenkins web admin app.

![Jenkins Web](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/jenkins15.png)

20. Login to Jenkins with the username and password retrieve from the bitnami credentials flat file

![Jenkins Login](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/jenkins16.png)

21. Screenshot the jenkins dashboard page with the URL shown on the address bar. Save the screenshot to Luminus submission folder.
