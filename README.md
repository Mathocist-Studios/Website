
<a id="readme_top"></a>

[![Unlicense License][license-shield]][license-url]
[![Commits][commit-shield]][commit-url]

<br />

<h1 align="center">Mathochist Studios Website Source</h3>
<h3 align="center">https://mathochiststudios.com</h3>

<br />

## About

The source code for the Mathochist studios website for downloading our game and deliverables. You can access the production site through https://mathochiststudios.com.


## Built With

* [![Express.js](https://img.shields.io/badge/Express.js-%23404d59.svg?logo=express&logoColor=%2361DAFB)](#)
* [![Node.js](https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white)](#)
* [![nginx](https://img.shields.io/badge/nginx-009639?logo=nginx&logoColor=fff)](#)
* [![CSS](https://img.shields.io/badge/CSS-639?logo=css&logoColor=fff)](#)
* [![HTML](https://img.shields.io/badge/HTML-%23E34F26.svg?logo=html5&logoColor=white)](#)
* [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000)](#)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

Built on:
* Node v22.14.0
* NPM v10.9.2

Update Node
```sh
npm install npm@latest -g
```

1. Clone Repo
```sh
git clone https://github.com/Mathocist-Studios/Webiste.git
```

2. Setup Project and Install Dependencies
```sh
node init
npm install axios body-parser cookie-parser cors dotenv ejs express express-validator express-rate-limit helmet html morgan uuid
```

3. Create .env
```.env
PORT=<Your Port>
ADMIN_EMAIL_ADDRESS=<Your admin email>
GOOGLE_CLIENT_ID=<Your Google API Client ID>
GOOGLE_CLIENT_SECRET=<Your Google API Client Secret>
GOOGLE_REFRESH_TOKEN=<Your Google API Refresh Token>
```

4. Change Git remote URL to avoid accidental pushes to repo
```sh
git remote set-url origin Mathocist-Studios/Website
git remote -v # confirm the changes
```

5. Run project
```sh
node src
```

## License

Distributed under the Unlicense License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[license-shield]: https://img.shields.io/github/license/Mathocist-Studios/Website?style=for-the-badge
[license-url]: https://github.com/Mathocist-Studios/Website/blob/master/LICENSE
[commit-shield]: https://img.shields.io/github/commit-activity/y/Mathocist-Studios/Website?style=for-the-badge
[commit-url]: https://github.com/Mathocist-Studios/Website/blob/master
