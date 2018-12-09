const fs = require('fs-extra')
const klaw = require('klaw')
const moment = require('moment')

const [input, output] = process.argv.slice(2)

const files = []
klaw(input)
  .on('data', item => {
    if (!item.stats.isDirectory()) {
      //files.push(item)
      const { path, stats } = item

      const [fileName, parentFolder] = path.split('/').reverse()
      //console.log(fileName, parentFolder)
      const fileMoment = moment(stats.birthtimeMs)
      const date = fileMoment.format('YYYY-MM-DD')
      const month = fileMoment.format('MM')
      const year = fileMoment.format('YYYY')
      const folderNameToCreate = year + '/' + month
      const filenameToCreate = parentFolder + ' ' + fileName

      const target = output + '/' + folderNameToCreate + '/' + filenameToCreate
      fs.copy(
        path,
        target,
        {
          dereference: true,
          preserveTimestamps: true
        },
        err => {
          if (err) {
            console.error(err)
          } else {
            console.log('copied', path, target)
          }
        }
      )
    }
  })
  .on('end', () => {
    //console.log('all files', files)
    files.forEach(file => {})
  })
