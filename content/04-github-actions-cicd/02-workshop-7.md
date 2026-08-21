---
title: "Workshop 7"
order: 2
videoUrl: "https://youtu.be/CwcUoJ26GDI"
submission: |
  # Workshop 7 - Code Review - Lint, SAST, DAST Workshop Submission

  ## Instructions

  Students are required to download the following report files from the GitHub Actions workflow and upload them to NUS Canvas:

  1. **sast-report.zip** - SAST (Static Application Security Testing) Report
  2. **linting tool report.zip** - Linting Tool Report
  3. **zap report.zip** - ZAP (OWASP Zed Attack Proxy) Report

  ### How to Download Reports

  1. Navigate to your GitHub repository
  2. Click on the **Actions** tab
  3. Select the completed workflow run
  4. Scroll down to the **Artifacts** section
  5. Download each of the 3 report files

  ## Submission Guidelines

  1. Ensure all 3 report files are downloaded from your GitHub Actions workflow
  2. Verify the reports contain valid scan results
  3. Upload all report files to the designated NUS Canvas assignment folder
  4. Name your files with your name prefix if required: `<your_name>_sast-report.zip`, etc.

  ## Deadline

  Please refer to NUS Canvas for the submission deadline.
---

# S-DOEA - Workshop 7 - Linting, DAST, SAST

## Pre-requisites

- Workshop 6 Github Repo

## Linting

1. Under the .github/workflows directory create a lint file with the below's content. Filename: lint.yml

```yaml
name: "linting-tool-scan"

on:
  push:
    branches: [githubcicd]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [16.x]

    steps:
      - uses: actions/checkout@v2

      - name: Install Dependencies
        if: steps.cache-nodemodules.outputs.cache-hit != 'true'
        run: |
          npm ci --force

      - name: Installing JSHint
        run: |
          sudo npm install -g jshint

      - name: Change script permission
        run: |
          chmod +x scripts/jshint-script.sh

      - name: Run scan with JSHint
        run: scripts/jshint-script.sh

      - name: Archive production artifacts
        uses: actions/upload-artifact@v4
        with:
          name: linting tool report
          path: |
            ./JSHint-report
```

2. Create a new scripts directory on the root directory of your project folder

3. Under the scripts folder create a jshint script file with the below's content. Filename: jshint-script.sh

```bash
#!/bin/bash

jshint --exclude="node_modules/" --reporter=unix . > JSHint-report

echo $? > /dev/null
```

## SAST

1. Under the .github/workflows directory create the sast scan yml file with the below's content. Filename: sast-scan.yml

```yaml
name: "sast-scan"

on:
  push:
    branches: [githubcicd]

jobs:
  sast:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'

      - name: Install dependencies
        run: npm ci --force

      - name: Download OWASP Dependency-Check
        run: |
          wget https://github.com/dependency-check/DependencyCheck/releases/download/v12.2.2/dependency-check-12.2.2-release.zip
          unzip -q dependency-check-12.2.2-release.zip -d $HOME/dependency-check

      - name: Run OWASP Dependency-Check
        run: |
          chmod +x $HOME/dependency-check/dependency-check/bin/dependency-check.sh
          $HOME/dependency-check/dependency-check/bin/dependency-check.sh \
            --project "bitcoin" \
            --nvdDatafeed 'https://open-vulnerability-data-mirror-production.up.railway.app/nvdcve-{0}.json.gz' \
            --out . \
            --scan . \
            --disableOssIndex

      - name: Archive SAST report
        uses: actions/upload-artifact@v4
        with:
          name: sast-report
          path: ./dependency-check-report.html
```

## DAST

1. Under the .github/workflows directory create the dast scan yml file with the below's content. Filename: zap-scan.yml

```yaml
name: "owasp-scan"

on:
  push:
    branches: [githubcicd]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [16.x]

    steps:
      - uses: actions/checkout@v2

      - name: Change script permission
        run: |
          chmod +x scripts/zap-script.sh

      - name: ZAP scan
        run: scripts/zap-script.sh

      - name: Archive production artifacts
        uses: actions/upload-artifact@v4
        with:
          name: zap report
          path: |
            ./zap_baseline_report.html
```

2. Under the scripts directory create the dast script file with the below's content. Filename: zap-script.sh

```bash
#!/bin/bash

docker pull zaproxy/zap-stable
docker run -i zaproxy/zap-stable zap-baseline.py -t "https://kenken64.github.io/bitcoin-order-app/" -l PASS > zap_baseline_report.html

echo $? > /dev/null
```

## Final

1. Check in all the codes to the githubcicd branch

```bash
git add .
git commit -m "lint, dast,sast"
git push origin githubcicd
```

## Submission

1. Lint report

![Lint Report](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/Screenshot%20from%202022-09-16%2004-09-44.png)

2. SAST report

![SAST Report](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/Screenshot%20from%202022-09-16%2004-08-08.png)

3. DAST report

![DAST Report](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/Screenshot%20from%202022-09-16%2004-05-43.png)
