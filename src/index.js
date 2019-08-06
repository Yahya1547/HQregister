const path = require('path')
const express = require('express')
require('./db/mongoose')
const hbs = require('hbs')
const app = express()
const fs = require('fs')

// Gaguna aslinya kudunya html aja 
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Configurations
app.use(express.static(publicDirectoryPath))
app.use(express.urlencoded({
    extended : true
}))
app.use(express.json())

const port = process.env.PORT || 3000 

const User = require('../src/models/user')
const Tower = require('../src/models/tower')
// const ExcelData = require('../src/models/exceldata')
const kwitansi = require('../no_kwitansi.json')

const {nomerKwitansi, bikinFileExcel} = require('./js/functions')

// ~~~~~~~~ USERS ROUTER ~~~~~~~~ //

app.get('/users', async (req, res) => {
    res.render('registrasi_user')
})

app.post('/users/create', async (req, res) => {
    const user = new User(req.body)
    try {
        console.log(kwitansi)
        nomerKwitansi().then(() => {
            console.log(kwitansi)
            user.save()
        })
        res.send(user)
    } catch (error) {
        res.send(error)
    }
})

// ~~~~~~~ TOWER ROUTER ~~~~~~~ //
app.get('/tower', (req, res) => {
    res.render('registrasi_tower')
})

app.post('/tower/register', async (req, res) => {
    // console.log(req.body)
    const tower = new Tower(req.body)
    try {
        await tower.save()
        res.send({
            message : 'Successfully created a tower data'
        })
    } catch (e) {
        res.send(e)
    }
})

app.get('/tower/info', (req,res) => {

})

// ~~~~~~~ DATABASE EXCEL ~~~~~~~ //

app.get('/excel', (req,res) => {
    res.render('database_excel')
})

// ~~~~~~~ SERVER UP ~~~~~~~ //
app.get('', async (req, res) => {
    res.send('Connected')
})

app.listen(port, () => {
    console.log('Server is up on port ' + port + '.')
})