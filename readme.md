# Simple OPC-UA simulator server

A simple OPC server that just works if you're trying to learn the protocol

## Why?

Because there's not a single [free] OPC simulation server on the internet*

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

- Create a bind mount from `your/directory` to `/data`
- Add the following JSON-file to `your/directory/devices.json`:

<details>

<summary>Click to expand</summary>

```json
{
    "GDA-c2019_1": {
        "name": "Gasdruckanlage",
        "items": [
            {
                "name": "Rohr vorne",
                "id": "ns=0;b=1000",
                "items": [
                    {
                        "id": "ns=1;b=1000AABB",
                        "name": "Aktiv",
                        "value": true,
                        "valueMethods": [
                            "get",
                            "set"
                        ]
                    },
                    {
                        "id": "ns=1;b=1001BBEE",
                        "name": "Druck Rohr vorne, erstes Segment",
                        "value": 26,
                        "simulation": {
                            "type": "randomize",
                            "interval": 2.5,
                            "randomize": {
                                "min": 1,
                                "max": 9
                            }
                        },
                        "valueMethods": [
                            "get"
                        ]
                    },
                    {
                        "id": "ns=1;b=1002BBEE",
                        "name": "Druck Rohr vorne, zweites Segment",
                        "value": 29,
                        "simulation": {
                            "type": "randomize",
                            "interval": 2.5,
                            "randomize": {
                                "min": 1,
                                "max": 5
                            }
                        },
                        "valueMethods": [
                            "get"
                        ]
                    },
                    {
                        "id": "ns=1;b=1003BBEE",
                        "name": "Druck Rohr vorne, drittes Segment",
                        "value": 31,
                        "simulation": {
                            "type": "randomize",
                            "interval": 2.5,
                            "randomize": {
                                "min": 1,
                                "max": 3
                            }
                        },
                        "valueMethods": [
                            "get"
                        ]
                    },
                    {
                        "id": "ns=1;b=104BBEE",
                        "name": "Druck Rohr vorne, viertes Segment",
                        "value": 26,
                        "simulation": {
                            "type": "sinus",
                            "interval": 0.1,
                            "sinus": {
                                "amplitude": 5,
                                "offset": 26
                            }
                        },
                        "valueMethods": [
                            "get"
                        ]
                    }
                ]
            },
            {
                "name": "Rohr hinten",
                "id": "ns=0;b=2000",
                "items": [
                    {
                        "id": "ns=1;b=2001AAFF",
                        "name": "Druck Rohr hinten, erstes Segment",
                        "value": 26,
                        "simulation": {
                            "type": "randomize",
                            "interval": 2.5,
                            "randomize": {
                                "min": 1,
                                "max": 9
                            }
                        },
                        "valueMethods": [
                            "get"
                        ]
                    },
                    {
                        "id": "ns=1;b=2002AAFF",
                        "name": "Druck Rohr hinten, zweites Segment",
                        "value": 29,
                        "simulation": {
                            "type": "randomize",
                            "interval": 2.5,
                            "randomize": {
                                "min": 1,
                                "max": 5
                            }
                        },
                        "valueMethods": [
                            "get"
                        ]
                    },
                    {
                        "id": "ns=1;b=2003AAFF",
                        "name": "Druck Rohr hinten, drittes Segment",
                        "value": 31,
                        "simulation": {
                            "type": "randomize",
                            "interval": 2.5,
                            "randomize": {
                                "min": 1,
                                "max": 3
                            }
                        },
                        "valueMethods": [
                            "get"
                        ]
                    }
                ]
            }
        ]
    }
}
```

</details>

- Start the container: `docker-compose up -d`

## License

MIT

---

*Disagree? Please open an issue with the URL