const { writeFileSync } = require("fs");
const { cases } = require("./zeppelin_cases.json");

let yag_cases = [];
let guild = '725341600670023700';

let max = 1;
let numberwith2 = 0;

for (let c of cases) {
    if (!c.notes || c.notes.length === 0)
        c.notes = [{body:''}];

    let mod_name = c.mod_name.replaceAll("'", "''").replaceAll("\n","\\n");

    for (let note of c.notes) {
        let body = note.body.replaceAll("'", "''").replaceAll("\n","\\n");

        if (c.type === 3)
            body = "NOTE: " + body;

        if (body === '') continue;
    
        let yag_case = 
            `INSERT INTO public.moderation_warnings(created_at, updated_at, guild_id, user_id, author_id, author_username_discrim, message, logs_link) VALUES (` +
            `'${c.created_at}',` +  //   created_at = case.created_at
            `'${c.created_at}',` + //   updated_at = case.created_at
            `${guild},` + //   guild_id = 725341600670023700
            `'${c.user_id}',` + //   user_id = case.user_id
            `'${c.mod_id}',` + //   author_id = case.mod_id
            `'${mod_name}',` + //   author_username_discrim = case.mod_name
            `'${body}',` + //   message = case.notes[0].body
            `'');`//   logs_link = ''
    
        yag_cases.push(yag_case);

        if (yag_cases.length % 1000 === 0) {
            yag_cases.push('');
            yag_cases.push('');
            yag_cases.push('');
            yag_cases.push('');
            yag_cases.push('');
            yag_cases.push('');
            yag_cases.push('');
            yag_cases.push('');
            yag_cases.push('');
            yag_cases.push('');
        }
    }
}

writeFileSync("./yag_warnings.sql", yag_cases.join("\n"));