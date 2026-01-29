---
title: "Workshop 1"
order: 1
videoUrl: "https://www.youtube.com/watch?v=gM1veyZ3EoA"
submission: |
  # Workshop 1 - Github Workshop Submission

  ## Instructions

  Students are required to capture and upload the following screenshots to NUS Canvas:

  ### Screenshot 1 - Repository Setup
  Capture a screenshot showing your GitHub repository with the initial commit and README.md file.

  ![Screenshot 1](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/submission/workshop1/screen1.png)

  ### Screenshot 2 - Branch and Pull Request
  Capture a screenshot showing your branch creation and the pull request merge.

  ![Screenshot 2](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/submission/workshop1/screen2.png)

  ## Submission Guidelines

  1. Take clear screenshots that show the required information
  2. Ensure your GitHub username is visible in the screenshots
  3. Upload both screenshots to the designated NUS Canvas assignment folder
  4. Name your files as: `workshop1_screen1_<your_name>.png` and `workshop1_screen2_<your_name>.png`

  ## Deadline

  Please refer to NUS Canvas for the submission deadline.
---

# S-DOEA - Workshop 1 - Github Workshop

## Pre-requisites
* Individual workshop
* [Github](https://github.com/)/[Gitlab](https://about.gitlab.com/) account
* Download & Install Git for Windows https://git-scm.com/download/win
* Github SSH Windows 10 Setup https://dev.to/bdbch/setting-up-ssh-and-git-on-windows-10-2khk
* Github SSH MacOS Setup https://bit.ly/2Gndh54

### For mac users please use brew

Homebrew (http://brew.sh/) is another alternative to install Git. If you have Homebrew installed, install Git via

```bash
brew install git
```

## Instructions

1. Create/Sign up for a Github account

![Github signup](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/git1.png)

2. Create a working directory on your machine

```bash
mkdir Projects

cd Projects

mkdir ProjectA

cd ProjectA
```

3. Initialize the working directory as git enable project

```bash
git init
```

4. Go to the Github dashboard, add a new repository

![Add new repository](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/git2.png)

5. Create a repo on Github, do not initialize README.md

![Create repo](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/git3.png)

6. Associate the local working directory with the remote repository

```bash
git remote add origin https://github.com/<your github username>/ProjectA.git
```

![Remote add](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/git4.png)

7. Issue the following command to to verify the association is correct

```bash
git remote -v

origin	https://github.com/<your github username>/ProjectA.git (fetch)
origin	https://github.com/<your github username>/ProjectA.git (push)
```

8. Create a README.md documentation as the initial file for your newly created repository

```bash
echo "# ProjectA" >> README.md
```

9. Create a html file index.html file with following content place on the project A directory

```html
<!DOCTYPE html>
<html>
<body>

<h1>My First Heading</h1>
<p>My first paragraph.</p>

</body>
</html>
```

10. Add the files to the staging index

```bash
git add .
```

11. Confirm all the changes made to the working directory and ready to commit to the remote repository by issuing the following command. argument -m is comment to every check in of the source codes.

```bash
git commit -m "new"
```

12. Check in the changes to the remote repository

```bash
git push origin master

Counting objects: 7, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (7/7), done.
Writing objects: 100% (7/7), 510.18 KiB | 17.59 MiB/s, done.
Total 7 (delta 4), reused 0 (delta 0)
remote: Resolving deltas: 100% (4/4), completed with 4 local objects.
To https://github.com/<your github username>/ProjectA.git
   84e356d..b6c5251  master -> master
```

13. Verify all the files are pushed to the github repo after the above steps. Use your browser navigate to the https://github.com/kenken64/ProjectA.git (replace the github userid with yours)

14. Next on your terminal/command prompt let us create a branch in git.

```bash
git checkout -b enhancementA
```

15. In order to check the current branch run the below command, the terminal should see * pointed to the newly created branch name

```bash
git branch
```

16. Create a new file for this this newly created branch, index2.html

```html
<!DOCTYPE html>
<html>
<body>

<h1>My First Heading</h1>
<p>My first paragraph.</p>

</body>
</html>
```

17. Add the new file created for the new branch to the remote repository

```bash
git add .
```

```bash
git commit -m "new enhancement"
```

```bash
git push origin enhancementA -u
```

18. Navigate to the project A github url https://github.com/kenken64/ProjectA.git check the branch is created. (Replace the github userid with yours)

19. Create a pull request for your newly created branch

![Pull request](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/git6.png)

20. Merge your newly created branch with your master branch.

> **Note:** Whenever there is new files created or any changes to the current codebase if the developer would like to check in their codes please run step 8,9,10 again. For those of you not very comfortable with command line there are many IDE Git integration software out there. See below screen capture for Visual Studio Code Git Plugin. Also Git GUI Standalone software by Atlassian https://www.sourcetreeapp.com/

![VS Code Git](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/git5.png)

For branching, tagging and etc please visit the following link https://github.com/kenken64/NUSISS-DevOpsEng/blob/master/git/README.md

## Optional Workshop

21. Let's try out git merge with a typical combining multiple branches of commits from master and feature branches

![Git merge](https://raw.githubusercontent.com/kenken64/NUSISS-DevSecOpsEng/master/workshop/screens/git7.png)

22. Fork the following repository https://github.com/kenken64/gitmerge-workshop to your own github account

23. The outcome of this optional workshop is to merge all the feature and master branches changes to a new master combined version

```bash
git branch

*master
```

Make sure your current branch is master, make changes to the index.html for commit 1

```bash
nano index.html
```

```text
......
commit 1
```

Push the commit 1 to the master branch

```bash
git add .
git commit -m "commit 1"
git push origin master
```

Make changes to the index.html for commit 2

```bash
nano index.html
```

```text
......
commit 1
commit 2
```

Push the commit 2 to the master branch

```bash
git add .
git commit -m "commit 2"
git push origin master
```

Branch out from commit 2

Push the master branch's commit 2 to the feature1 branch

```bash
git checkout -b feature1
git add .
git commit -m "create feature 1 branch"
git push origin feature1
```

Create another feature2 branch from commit 2

```bash
git checkout -b feature2
```

Create new index5.html with any content. Save the file

```bash
nano index5.html
```

Push the master branch's commit 2 to the feature2 branch

```bash
git add .
git commit -m "feature 2"
git push origin feature2
```

Switch back to the master branch to the latest commit

```bash
git checkout master
```

Merge feature2 branch into master branch, where feature1 is being ignored.

```bash
git merge --squash feature2
```

24. Issue a commit command to stage the changes

```bash
git commit -m "feature2 and master combined with commit 1,2,3"
```

25. Push the final changes to the master branch

```bash
git push origin master -u
```

26. Edit the index2.html on the master branch, add a new paragraph right below hello world

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <p>Hello World</p>
    <p>Hello World 2</p>
</body>
</html>
```

27. Undo the mistakes done on the index2.html

```bash
git status
```

```bash
git restore index2.html
```

```bash
git status
```

28. Setup Claude desktop with GenAI Github Model Context Protocol server. Try out this prompt "Under my GitHub account, there's a repository named ProjectA. Is it possible to merge the test branch into the main branch? Create the pull request and merged it"

- https://claude.ai/download
- https://github.com/github/github-mcp-server
- https://www.deeplearning.ai/short-courses/mcp-build-rich-context-ai-apps-with-anthropic/

## Reference

* Software sourcetree - https://www.sourcetreeapp.com/
* Eclipse with Git - https://www.vogella.com/tutorials/EclipseGit/article.html
* Visual Studio Code - https://scotch.io/tutorials/git-integration-in-visual-studio-code
* Git Tower - https://www.git-tower.com/windows
* Undo your git mistakes - https://www.youtube.com/watch?v=lX9hsdsAeTk
