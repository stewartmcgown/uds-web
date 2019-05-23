# UDS web
> a web based, standalone client for unlimited drive storage by encoding files in base64

[Demo](https://sharp-einstein-92eca4.netlify.com/)

## Logic
- Cross compatible with any other UDS client
- Encodes files into base64 that is then inserted into Google Docs

## Usage
To get up and running run:
``` bash
$ npm install
$ npm run serve
```
Yes, that's it. Only two commands!

If you still think that's too much effort, you could also run:
``` bash
$ npm i && npm run serve
```
But yeah, this will basically do the same as `npm install`.
If even this is too much of a deal, try creating an alias and bind `npm install && npm run serve` to `npmis`.

## Configuration ##
You will have to specify your own API key and Client ID in order to use UDS.

