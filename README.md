## Setup

Clone the repository and install dependencies:

    git clone git://github.com/ahocevar/tuwien-geoweb-2017.git
    npm install

Now you're ready to start the  development server.  This serves up the application at http://localhost:3000/.

    npm start

## Deployment

To build the JavaScript client, run

    npm run build

The build artifacts will then be available in the `build` directory, ready to be deployed to the server.

In addition to the JavaScript client, the php server components from the `php` directory need to be deployed to the same directory.

The php components expect a PostgreSQL database on the same server, with an `ifip_feedback` table. The sql dump for creating that table can be found in the `postgis` directory.
