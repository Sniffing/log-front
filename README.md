# Setup
1. `npm install`
2. `npm start`

## log-front
This it the front end web page for third eye. This is requires a server to be running which access the data
stores in GCP. This project is log-back.

This project was created with create-react-app and as such benefits from everything that came with
the generator and can be ejected. Check `package.json` for more information

This project proxies all http calls through port 4000 as can be seen at the bottom of `package.json`

## Develop without backend
```npm run mock```

To run the code without the backend and mock api calls and api returns,
you can use the above command
