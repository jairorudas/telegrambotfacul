const env = require( './.env')
const Telegraf = require('telegraf')
const Telegram = require('telegraf/telegram')

//Arquivo json com as repostas 
const questions = require('./perguntas')()

const Bot = new Telegraf(env.TOKEN)
const telegram = new Telegram(env.TOKEN)

Bot.use(Telegraf.log())
 
Bot.start(ctx => {
    const from = ctx.update.message.from
    if(!!from) ctx.reply(`Fala meu mestre ${from.first_name}, manda aí!`)
})

// Bot.use((ctx, next) => {    
//     const from = ctx.update.message.from
//     console.log(ctx.update.message, 'use middle')
//     try {
//         env.CLIENT_ID !== from.id ? ctx.reply('Desculpa Só falo com quem conheço.') : next()    
//     } catch (error) {
//         netx()
//     }
// })


Bot.on('document', ctx => {
    console.log('==================== Document ============================')
    console.log(ctx.update.message.document.file_id, 'File ID')
    console.log(ctx.update.message.chat.id, 'Chat ID')
})

Bot.command('buscar', ctx => {
    console.log('===================== search ============================')
    ctx.replyWithHTML('<code> busca </code>')
})

Bot.on('text', ctx => {
    //forach

    let matchs = 0;
    let key = new RegExp(ctx.update.message.text, 'gi')

    questions.forEach((el, ind) => {
        let titulos = Object.values(el.perguntas)
        let file = el.file;
        let ano = el.ano;
        
        titulos.forEach((res, ind) => {

            if ( res !== '' && res.toLowerCase().search(key) > -1 ){

                telegram.sendDocument( env.CLIENT_ID, file ).then(res => {
                    ctx.replyWithMarkdown(`_pregunta:_  *${ ind + 1 }* `)
                })
                matchs += 1

            } 
        })

    })
    matchs === 0 ? ctx.reply('String não encontrada ☹') : false
    //console.log(ctx.telegram)
})

Bot.startPolling()