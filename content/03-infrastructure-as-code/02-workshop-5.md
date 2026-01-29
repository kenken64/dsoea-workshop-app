---
title: "Workshop 5"
order: 2
videoUrl: "https://youtu.be/pwio7OfsZz0"
submission: |
  # Workshop 5 - Infrastructure as Code - Ansible Submission

  ## Instructions

  Students are required to capture and upload the following screenshots to NUS Canvas:

  ### Screenshot 1 - Ansible Playbook Execution
  Capture a screenshot showing your Ansible playbook execution output.

  ![Screenshot 1](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/submission/workshop5/screen1.png)

  ### Screenshot 2 - Configured Server
  Capture a screenshot showing the server configured by Ansible.

  ![Screenshot 2](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/submission/workshop5/screen2.png)

  ## Submission Guidelines

  1. Take clear screenshots that show the required information
  2. Ensure the Ansible output and server configuration are visible
  3. Upload both screenshots to the designated NUS Canvas assignment folder
  4. Name your files as: `workshop5_screen1_<your_name>.png` and `workshop5_screen2_<your_name>.png`

  ## Deadline

  Please refer to NUS Canvas for the submission deadline.
---

# S-DOEA - Workshop 5 - Infrastructure as Code - Ansible

## Ansible - Part 1

The objective of this workshop is to automate the installation of Code-Server on a server

### Workshop
Provision a Ubuntu server for this exercise. You can use Terraform or manually provision an instance on DigitalOcean's console.

Once you have provisioned, note the IP address, root user and SSH keys used. Use these information to create an inventory file, inventory.yaml.

Write a playbook that will use the inventory.yaml file to configure the server. The playbook should perform the following tasks:

- Update the /lib/systemd/system/code-server.service file with the code server password; change the following line

```text
Environment=PASSWORD=__PLACEHOLDER__
```

with the password, assuming that the password is mypassword

```text
Environment=PASSWORD="mypassword"
```

- Update the /etc/nginx/sites-available/code-server.conf file with the domain code-<ipv4_address>.nip.io; change the line with server_name to

```text
server_name code-<ipv4_address>.nip.io;
```

- Use systemd module to restart nginx and code-server services. You must also perform a daemon reload viz. set daemon_reload to yes.

### Test
Test your deployment by browsing to `http://<ip-address>`

### Submission
When you have completed this workshop, commit your work to the repository. The instructor will clone your repository at the end

### Setup

1. Access your Digital Ocean account.

2. Create a Ubuntu Droplet

![Ansible Setup 1](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/ansible11.png)

- Select Singapore as region
- Select Ubuntu as the server Image v20.04 x64

![Ansible Setup 2](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/ansible12.png)

- Select cost saving server type (6 USD)

![Ansible Setup 3](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/ansible13.png)

- Choose the SSH authentication method and generate a fresh SSH key pair. Click the "New SSH Key" button, then follow the instructions provided on the right-hand side. Paste the contents of the "cat" command into the Digital Ocean text area.

![Ansible Setup 4](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/ansible14.png)

- Finalize the droplet

![Ansible Setup 5](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/ansible15.png)

3. Access the newly created ubuntu server

```bash
ssh root@<public ip address>
```

![Ansible Setup 6](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/ansible16.png)

4. Generate the PKI key pair on the logon server

```bash
ssh-keygen
```

![Ansible Setup 7](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/ansible17.png)

5. Add the public key content to the Digital Ocean account security section, name it as www-1

![Ansible Setup 8](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/ansible18.png)

![Ansible Setup 9](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/ansible19.png)

6. Install terraform IAC tool on the ubuntu server

```bash
sudo apt update
```

```bash
sudo apt install snap
```

```bash
sudo snap install terraform --classic
```

7. Check the terraform version

```bash
terraform --version
```

![Ansible Setup 10](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/ansible22.png)

8. Install Ansible on the Ubuntu instance

```bash
sudo apt-add-repository ppa:ansible/ansible

sudo apt update

sudo apt install ansible-core
```

9. Check the ansible version

```bash
ansible --version
```

### Implementation

a. Create a directory called workshop02 in your course repository.

b. Read Step 1 and Step 2 of the following blog (do not need to run any command in this page, FYI)
https://www.digitalocean.com/community/tutorials/how-to-set-up-the-code-server-cloud-ide-platform-on-ubuntu-20-04.html

c. Change directory into the workshop02 folder

d. Create an ansible template file for server configuration. code-server.conf.j2

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name {{codeserver_domain}} {{ansible_host}};

    location / {
        proxy_pass http://127.0.0.1:8080/;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection upgrade;
        proxy_set_header Accept-Encoding gzip;
    }
}
```

e. Create an ansible template file code-server.service.j2

```ini
[Unit]
Description=code-server
After=nginx.service

[Service]
Type=simple
Environment=PASSWORD={{codeserver_password}}
ExecStart=/usr/bin/code-server --bind-addr 127.0.0.1:8080 --user-data-dir /var/lib/code-server --auth password
Restart=always

[Install]
WantedBy=multi-user.target
```

f. Create a terraform template file inventory.yaml.tftpl

```yaml
all:
    vars:
        ansible_connection: ssh
        ansible_user: root
        ansible_ssh_private_key: ${ssh_private_key}
    hosts:
        codeserver:
            ansible_host: ${codeserver_ip}
            codeserver_domain: ${codeserver_domain}
            codeserver_password : ${codeserver_password}
```

g. Create a provider terraform script provider.tf

```hcl
terraform {
  required_providers {
    digitalocean = {
        source = "digitalocean/digitalocean"
        version = "2.26.0"
    }
    local = {
        source = "hashicorp/local"
        version = "2.4.0"
    }
  }
}

provider digitalocean {
    token = var.do_token
}
```

h. Create a variables terraform script variables.tf

```hcl
variable do_token {
    type = string
    sensitive = true
}

variable do_region {
    type = string
    default = "sgp1"
}

variable do_image {
    type = string
    default = "ubuntu-22-04-x64"
}

variable do_size {
    type = string
    default = "s-1vcpu-1gb"
}

variable do_ssh_key {
    type = string
    default = "www-1"
}

variable ssh_private_key {
    type = string
}

variable codeserver_password {
    type = string
}
```

i. Create a resources terraform script resources.tf

```hcl
#ssh key
data "digitalocean_ssh_key" "www-1" {
    name = var.do_ssh_key
}

resource "digitalocean_droplet" "codeserver" {
    name = "codeserver"
    image = var.do_image
    region = var.do_region
    size = var.do_size

    ssh_keys = [ data.digitalocean_ssh_key.www-1.id ]
}

resource "local_file" "root_at_codeserver" {
    filename = "root@${digitalocean_droplet.codeserver.ipv4_address}"
    content = ""
    file_permission = "0444"
}

resource "local_file" "inventory" {
    filename = "inventory.yaml"
    content = templatefile("inventory.yaml.tftpl",{
        codeserver_ip = digitalocean_droplet.codeserver.ipv4_address
        ssh_private_key = var.ssh_private_key
        codeserver_domain = "code-server-${digitalocean_droplet.codeserver.ipv4_address}.nip.io"
        codeserver_password = var.codeserver_password
    })
    file_permission = "0444"
}

output codeserver_ip {
    value =  digitalocean_droplet.codeserver.ipv4_address
}
```

Remember to generate the Digital Ocean Personal Access Token and export to the environment variable

```bash
export DO_PAT=<your DO PAT>
```

```bash
terraform init
```

```bash
terraform plan -var "do_token=${DO_PAT}" -var "ssh_private_key=/root/.ssh/id_rsa" -var "codeserver_password=password123456"
```

```bash
terraform apply -auto-approve -var "do_token=${DO_PAT}" -var "ssh_private_key=/root/.ssh/id_rsa" -var "codeserver_password=password123456"
```

Get the playbook.yml from the solution github repository

```bash
ansible-playbook playbook.yaml -i inventory.yaml
```

## Solution Repository URL

https://github.com/kenken64/aipc-jun2023/tree/main/workshop02
