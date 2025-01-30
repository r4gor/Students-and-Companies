# Students&Companies (S&C)

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