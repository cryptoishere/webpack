<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Webpack 5, PHP & Live Reload</title>
</head>

<body>
    <div class="container">
        <h1>livecode</h1>
        <h1>Webpack 5 Bundle Build</h1>
        <a id="contact" href="../contact/contact.html">Contact</a>
        <hr />
        <div class="logo-wrapper">
            <div class="logo"></div>
        </div>
        <div class="banner">
            <img id="webpack-image" src="" alt="Webpack">
        </div>
        <hr />
        <pre class="webpack-post"></pre>
        <hr />
        <div class="box">
            <h2>CSS</h2>
        </div>
        <div class="card">
            <h2>SCSS</h2>
        </div>

        <?php
          function displayInfo() {
            return phpinfo();
          }
          displayInfo();
        ?>
    </div>
</body>

</html>