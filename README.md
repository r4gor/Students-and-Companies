# Students&Companies (S&C)
## Result: 30L/30
## Prerequisites
- Docker (tested on v27.2 but should work with other versions)
- Node v22.12.0 LTS
- Docker Compose (tested on v2.20.3 but should work with other versions)
- npm (tested on v11.0.0)


## How to install and run locally

### Database
```
cd app/backend
```

Build the docker image:
```
docker-compose build
```

To create and run the container:
```
docker-compose up -d
```

To check container status:
```
docker ps -a
```

Now the database is up and running on port 5432.

### Backend server
```
cd app/backend
```
```
npm install
npm run dev
```
The backend will be available on `http://localhost:4000`, which automatically restarts the node application when file changes in the directory are detected.

To build for production (not necessary for testing) run:
```
npm run build
```
The build output will be located in the `dist/` directory.

### Frontend
```
cd app/frontend
```
```
npm install
npm run dev
```
The frontend will be available on `http://localhost:5173`, with Hot Module Replacement (HMR, also called "hot reload").

To build for production (not necessary for testing) run:
```
npm run build
```
The build output will be located in the `dist/` directory.

### Testing
MAKE SURE the database container is up and running before running the following commands.

To run all the test navigate to the backend folder: 
```
cd app/backend
``` 
and run the following command:
```
npm test
``` 
the results of all test will appear in the terminal along with additional information. After the test run ends, the html documentation regarding test coverage will be generated inside the `app/backend/coverage` folder. 
