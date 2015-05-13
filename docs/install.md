
# Plato: Install Guide

  1. [Install `node` and `npm`.](#1-install-node-and-npm)
  2. [Create your GitHub repo.](#2-create-your-github-repo)
  3. [Install `plato`.](#3-install-plato)
  4. [Create your blog with Plato.](#4-create-your-new-blog-with-plato)
  5. [Write your first article!](#5-write-your-first-article)
  6. [Connect your blog directory with GitHub.](#6-connect-your-blog-directory-with-github)
  7. [Configure your domain name's DNS settings.](#7-configure-your-domain-names-dns-settings)
  8. [Deploy your new blog!](#8-deploy-your-new-blog)


### 1. Install `node` and `npm`.

First, you need to have `node` and `npm` installed. Go to [nodejs.org](https://nodejs.org) and follow the install instructions there.

![](https://cldup.com/nRFr6iISMY.png)

![](https://cldup.com/rC7zBYt9oL.png)


### 2. Create your blog's GitHub repo.

Next, you need to create a repository on GitHub where you will store all of your blog articles. Go to [github.com/new](https://github.com/new) and create a repository named:

```
YOURUSERNAME.github.com
```

So for example, [@ianstormtaylor](https://github.com/ianstormtaylor)'s blog repository would be called `ianstormtaylor.github.com`. This is because this is a special page that [GitHub will let you host a website on](https://pages.github.com/).

![](https://cldup.com/gk4jgVtxIT.png)


### 3. Install `plato`.

Next, you need to install Plato itself. Copy-and-paste the follow commands into your **Terminal**:

```shell
mkdir -p ~/dev/segmentio
cd ~/dev/segmentio
git clone https://github.com/segmentio/plato.git
cd plato
make install
```


### 4. Create your new blog with Plato.

Now that you have Plato installed, you will use it to generate your new blog from scratch. Copy-and-paste these commands into your **Terminal**:

```shell
mkdir -p ~/dev/YOURUSERNAME
cd ~/dev/YOURUSERNAME
plato create YOURUSERNAME.github.com
```

Plato will ask you a few questions, answer them. Once you've finished, run:

```shell
cd YOURUSERNAME.github.com
```


### 5. Connect your blog directory with GitHub.

Now that you have a GitHub repository, and your blog's new directory created, you need to conncet to the two. Run:

```shell
git init
git remote add origin git@github.com:YOURUSERNAME/YOURUSERNAME.github.com.git
git push -u origin master
git checkout -b dev
```


### 6. Configure your domain name's DNS settings.

You'll need to log in to the place you bought your domain name from. And then find out where you can **add or configure your DNS settings**. Once you've located that, follow this GitHub guide: https://help.github.com/articles/tips-for-configuring-an-a-record-with-your-dns-provider/


### 7. Write your first article!

Now you've got everything installed. Time to get writing. While you're writing, you'll want to preview what your article is looking like. To do that, run:

```shell
plato preview
```

And visit the link it gives you in your browser. You should see your new blog.


### 8. Deploy your new blog!

Finally, once you're ready to deploy... first save your work by doing:

```shell
plato save
```

And then deploy your website to the interwebs with:

```shell
plato deploy
```

You're done!
