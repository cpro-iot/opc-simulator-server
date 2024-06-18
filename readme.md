# Simple OPC-UA simulator server

A simple OPC server that just works if you're trying to learn the protocol or need to simulate a device for your clients

## Why?

Because there's not a single [free] OPC simulation server on the internet that works*

## Features

### Current

- Deployable over docker without any hardware configuration
- Supports OPC-UA `READ`, `WRITE`, `SUBSCRIBE` (and more) on object variables
- Create your own objects and simulate variable changes:
  - increase
  - decrease
  - randomize
  - sinus
- Bring your own simulation config or use ours

### Planned

- A GUI to maintain `devices.json`
- A cloud instance for public usage
- Further simulation cases which can be configured over JSON

### Non-features

These features will not be implemented as part of this repository. If you have any custom requests, please contact us under **info@cpro-iot.com**

- Productive usage on anything (it's a **simulation server**)
- Advanced OPC-Config (we're just using JSON and the Objects-folder here)
- Live-data connections to hardware or SPS
- An OPC-Client with a GUI

## Installation

### Development

- Fork & clone this repository
- Run `docker-compose up`
- Make changes
- Open a pull request
- If your changes are accepted, they'll be automatically built and deployed to Dockerhub

### Simulations

**Our default config:**
- Run `docker run -p 4840:4840 -it cpro-iot/opc-simulator-server`

**Your own config:** [see below](#upc-node-configuration)

- Run `docker run -p 4840:4840 -it -v your/directory:/data cpro-iot/opc-simulator-server`

## UPC-Node configuration

> If you do not configure UPC-Node, a simple default configuration is used by default

- Create a folder on your host machine (e.g. `./data`)
- Adjust the compose file to use it as a bind mount to `app/data` by commenting out `app` - service and uncomment `app_deploy`
- Add the [device configuration](https://github.com/tq-bit-cpro/opc-simulator-server/wiki) to `your/directory/devices.json`:
- Start the container: `docker-compose up -d`

## License

MIT

---

*Disagree? Please open an issue with the URL