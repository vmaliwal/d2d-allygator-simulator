# D2D Allygator Shuttle Simulation

An Allygator Shuttle Simulation powered by Door2Door's driver simulator data.

## Tech
- [NodeJS ](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Redis](https://redis.io/)
- [Socket.IO](https://socket.io/)
- [MapBox](https://www.mapbox.com/)
- [Docker](https://www.docker.com/)

### Why?
- MongoDb acts as an EventStore and stores all simulation events emitted by the driver simulator app, along with vehicle's data.
- Websockets are used to deliver location data to the front-end map using Redis & Socket.io.
- Mapbox is utilized for convenience of visualizing location data on the map.

## Installation

For convinence this application is dockerized and can be run locally by following below steps - 

### Download
Clone/Download the repository and `cd` into the downloaded directory

```
$ cd d2d-allygator-simulator
```

### Build docker image
```
$ docker-compose build
```

### Run the app
```
$ docker-componse up
```

Shuttle simulation app should be available on `localhost:3000`. You will be greated with a street view of Berlin.

### To view simulation data on map
> IMPORTANT: You need to have access to Door2Door's driver simulator app. Otherwise simulation data will not work
```
$ driver-simulator> yarn start localhost:3000
```

## To run tests
```
$ d2d-allygator-simulator>cd back-end
$ d2d-allygator-simulator/back-end> npm test
```

## TODOS
- Write tests for front-end.
- Clustering on markers on the map.
- Improve additonal coverage for back-end.
- Handling errors and edge-cases.
- Load test the app by running multiple instances behind a load balancer.
- Use env variables where necessary, for example port binding, etc.