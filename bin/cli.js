#!/usr/bin/env node

const path = require('path')
const program = require('commander')

const pjson = require('../package.json')
const Vapid = require('../lib/vapid')

function actionHandler(fn) {
  return (target) => {
    global.vapid = new Vapid(target)

    try {
      fn(target)
    } catch (err) {
      vapid.log.error(err)
    }
  }
}

// NEW
program
  .command('new <target>')
  .description('create a new project')
  .action(actionHandler(target => {
    vapid.initSite()
    vapid.log.info('Site created.')
    vapid.log.extra([
      'To start the development server now, run:',
      `  ${pjson.name} server ${target}`
    ])
  }))

// SERVER
program
  .command('server')
  .description('start the server')
  .action(actionHandler(site => {
    vapid.log.info(`Starting the ${vapid.env} server...`)
    vapid.startServer()
    vapid.log.extra([
      `View your site at http://localhost:${vapid.server.port}`,
      'Ctrl + C to quit'
    ]);
  }))

// VERSION
program
  .command('version')
  .description('shows the version number')
  .action(actionHandler(target => {
    vapid.log.extra(`Vapid ${program.version()}`)
  }))

// CATCH-ALL
program
  .command('*', { noHelp: true })
  .action(actionHandler(target => {
    vapid.log.error(`Command "${process.argv[2]}" not found.`)
    program.help()
  }))

if (process.argv.slice(2).length) {
  program
    .version(pjson.version)
    .parse(process.argv)
} else {
  program.help()
}
