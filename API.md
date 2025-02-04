<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![GNU GENERAL PUBLIC LICENSE][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<br />
<div align="center">
  <a href="https://github.com/cmcintosh/akira_the_ai">
    <img src="logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Akira AI: Plugins</h3>

  <p align="center">
    This is the API documentation needed for extending the Akira AI platform. Akira uses a Plugin based system to
    allow developers to add new functionality to it, in a way that is scalable and sustainable. You can define
    your own hooks using the Plugin system, or utilize any hooks that are defined by other plugins or core systems
    in the system. Below will be an overview of all the core system plugins and core plugins.
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#menu-routing"">Menu Routing</a>
    </li>
    <li>
      <a href="#getting-started">Networks</a>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
<a id="menu-routing">
## Menu Routing

The system uses a single Quart based httpd server to provide it's web ui. If you need to add a restful endpoint or a web page, then
you will need to leverage the __http_route__ hook.  You can do this by adding something similar to the below code, in your plugin.

```python



```

<p align="right">(<a href="#readme-top">back to top</a>)</p>