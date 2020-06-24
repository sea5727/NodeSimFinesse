var myArgs = process.argv.slice(2);
console.log('path:', myArgs[0]);
var path = myArgs[0]


const prettifyXml = require('prettify-xml')
const fs = require('fs') 
const options = {indent: 2, newline : '\n'} // 2 spaces is default, newline defaults to require('os').EOL

fs.readFile(path, 'utf8', (err, data) => {
    if(err) return
    data.replacea
    data = data.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
    const output = prettifyXml(data, options)
    console.log(output)
    fs.writeFile(path, output, (err) => {
        if(err)
            console.log(err)
    })
})