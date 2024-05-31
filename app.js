import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import { fileURLToPath } from 'url'
import PicoController from 'pico-ctrl'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const pico = new PicoController()


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


app.use(express.static(path.join(__dirname, 'public')))


app.get('/connect', async(req, res) => {
  try {
    await pico.findPico()
    res.status(200).send('Pico connected.')
  } catch (error) {
    res.status(500).send('Error connecting to Pico: ' + error.message)
  }
})


app.get('/reboot', async(req, res) => {
})


app.get('/restart', async(req, res) => {
  try {
    await pico.restartInFSMode()
    res.status(200).send('Pico restarted in FS mode.')
  } catch (error) {
    res.status(500).send('Error restarting Pico: ' + error.message)
  }
})


app.post('/load-uf2', async(req, res) => {
  const uf2Path = req.body.path
  
  try {
    await pico.loadUF2(uf2Path);
    res.status(200).send('UF2 file loaded.')
  } catch (error) {
    res.status(500).send('Error loading UF2 file: ' + error.message)
  }
})


app.post('/send-py', async(req, res) => {
  const pyPath = req.body.path
  
  try {
    await pico.sendPyFile(pyPath)
    res.status(200).send('Python file sent.')
  } catch (error) {
    res.status(500).send('Error sending Python file: ' + error.message)
  }
})


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})


export default app