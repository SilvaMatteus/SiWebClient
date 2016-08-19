# SI Project

Link to site:
    http://web.cloud.lsd.ufcg.edu.br:43180/

## How to run locally?

There is two components: web and api.

#### To run web component:

If you have not nodeJS installed, you can follow this steps:

install Node Version Manager:

    http://www.liquidweb.com/kb/how-to-install-nvm-node-version-manager-for-node-js-on-ubuntu-12-04-lts/

To follow good practices of web programming, we are using bower
to manage dependencies. You can see more about at https://bower.io/.

Install nodeJS and bower using the following commands:

    nvm install stable  # It will install the stable version of nodeJS
    npm install -g bower # It will install bower

Go to web directory and run the following command to get dependencies needed:

    bower install

To run our application a web-server is needed. We recommend ws (local-web-server):

    npm install local-web-server

To start your local web service (If you are using the recommended local-web-server)
run the following command into .../web/ directory:

    ws

It will probably make the application available at

    localhost:8000

### To run the api command:

We are using a micro-framework called Flask.
To run .../api/api.py some libraries are required. To install it need to have
PyPi (Python Package Index) installed. Read more at https://pypi.python.org/pypi/pip.

If you are using Linux, PyPi can be installed easily doing:

    sudo apt-get install python-pip

After install PyPi, run the following command to install all of the requirements\*:
\* Run this command in the same directory where is requirements.txt file.

    sudo pip install -r requirements.txt

Now, with the requirements installed, just run the api.py like any other python file.

    python api.py
