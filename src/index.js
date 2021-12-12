import * as $ from 'jquery'
import Post from '@models/Post'
// import json from './assets/json.json'
// import xml from './assets/data.xml'
// import csv from './assets/data.csv'
import WebpackPngUrl from '@/assets/webpack-logo.png'
import sthGifUrl from '@/assets/sth.gif'
import './styles/styles.css'
import './styles/scss.scss'

$('#webpack-image').attr("src", WebpackPngUrl);

const postWebpack = new Post('Powered by Webpack', WebpackPngUrl, new URL("/", 'https://webpack.js.org/'))
$('pre.webpack-post').addClass('code').html(postWebpack.toString())

// console.log('JSON:', json)
// console.log('XML:', xml)
// console.log('CSV:', csv)
